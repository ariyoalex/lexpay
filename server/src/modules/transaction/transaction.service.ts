import Transaction, { ITransaction } from "../../models/Transaction";
import { ApiError } from "../../utils/apiError";
import PDFDocument from "pdfkit";

type LeanTransaction = ITransaction & { createdAt?: Date; updatedAt?: Date };

export interface TransactionQuery {
  userId?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
}

interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const buildFilter = (query: TransactionQuery): Record<string, any> => {
  const filter: Record<string, any> = {};
  if (query.userId) filter.userId = query.userId;
  if (query.type) filter.type = query.type;
  if (query.status) filter.status = query.status;
  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
  }
  if (query.minAmount !== undefined || query.maxAmount !== undefined) {
    filter.amount = {};
    if (query.minAmount !== undefined) filter.amount.$gte = query.minAmount;
    if (query.maxAmount !== undefined) filter.amount.$lte = query.maxAmount;
  }
  return filter;
};

export const listTransactions = async (query: TransactionQuery): Promise<PaginatedResult<any>> => {
  const filter = buildFilter(query);
  const page = query.page || 1;
  const limit = Math.min(query.limit || 20, 100);
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Transaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Transaction.countDocuments(filter),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getTransactionById = async (id: string) => {
  const txn = await Transaction.findById(id).lean();
  if (!txn) throw ApiError.notFound("Transaction not found");
  return txn;
};

export const getTransactionByReference = async (reference: string) => {
  const txn = await Transaction.findOne({ reference }).lean();
  if (!txn) throw ApiError.notFound("Transaction not found");
  return txn;
};

export const exportCsv = async (query: TransactionQuery): Promise<string> => {
  const filter = buildFilter(query);
  const transactions = await Transaction.find(filter).sort({ createdAt: -1 }).lean();

  const headers = "Reference,Type,Amount,Fee,Balance Before,Balance After,Status,Description,Date\n";
  const rows = transactions
    .map((t: any) =>
      [
        t.reference,
        t.type,
        t.amount,
        t.fee || 0,
        t.balanceBefore,
        t.balanceAfter,
        t.status,
        `"${(t.description || "").replace(/"/g, '""')}"`,
        t.createdAt ? new Date(t.createdAt).toISOString() : "",
      ].join(","),
    )
    .join("\n");

  return headers + rows;
};

export const exportPdf = async (query: TransactionQuery): Promise<Buffer> => {
  const filter = buildFilter(query);
  const transactions = await Transaction.find(filter).sort({ createdAt: -1 }).lean();

  const doc = new PDFDocument({ margin: 40, size: "A4" });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  return new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const font = "Helvetica";
    const bold = "Helvetica-Bold";
    const txns = transactions as unknown as LeanTransaction[];

    doc.font(bold).fontSize(18).text("LexPay Transaction Statement", { align: "center" });
    doc.moveDown(0.5);
    doc
      .font(font)
      .fontSize(9)
      .fillColor("#666")
      .text(`Generated: ${new Date().toLocaleDateString()}`, { align: "center" });
    if (query.startDate || query.endDate) {
      doc.text(`Period: ${query.startDate || "—"} to ${query.endDate || "—"}`, { align: "center" });
    }
    doc.moveDown(1);

    const tableTop = doc.y;
    const colWidths = [100, 70, 70, 70, 90, 70, 80];
    const headers2 = ["Reference", "Type", "Amount", "Fee", "Description", "Status", "Date"];
    let y = tableTop;

    doc.font(bold).fontSize(8).fillColor("#333");
    let x = 40;
    headers2.forEach((h, i) => {
      doc.text(h, x, y, { width: colWidths[i], align: "left" });
      x += colWidths[i];
    });
    doc.moveDown(0.5);
    y = doc.y;

    let totalAmount = 0;
    let totalFee = 0;

    doc.font(font).fontSize(7).fillColor("#444");
    for (const t of txns) {
      if (y > 720) {
        doc.addPage();
        y = 40;
      }

      x = 40;
      const row = [
        t.reference.slice(-12),
        t.type,
        t.amount.toLocaleString(),
        (t.fee || 0).toLocaleString(),
        (t.description || "").slice(0, 20),
        t.status,
        t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "",
      ];

      row.forEach((cell, i) => {
        doc.text(cell, x, y, { width: colWidths[i], align: "left" });
        x += colWidths[i];
      });

      totalAmount += t.amount;
      totalFee += t.fee || 0;
      y += 14;
    }

    doc.moveDown(1);
    doc.font(bold).fontSize(9).fillColor("#000");
    doc.text(`Total Amount: ₦${totalAmount.toLocaleString()}`, 40, doc.y);
    doc.text(`Total Fees: ₦${totalFee.toLocaleString()}`, 40, doc.y + 14);

    doc.end();
  });
};

export const generateStatement = async (userId: string, startDate?: string, endDate?: string) => {
  const filter: Record<string, any> = { userId };
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const transactions = await Transaction.find(filter).sort({ createdAt: 1 }).lean();

  const openingBalance = transactions.length > 0 ? transactions[0].balanceBefore : 0;
  const closingBalance = transactions.length > 0 ? transactions[transactions.length - 1].balanceAfter : 0;
  const totalCredits = transactions
    .filter((t) => ["credit", "funding", "transfer_in"].includes(t.type))
    .reduce((s, t) => s + t.amount, 0);
  const totalDebits = transactions
    .filter((t) => ["debit", "withdrawal", "transfer_out", "bill_payment"].includes(t.type))
    .reduce((s, t) => s + t.amount, 0);
  const totalFees = transactions.reduce((s, t) => s + (t.fee || 0), 0);

  return {
    period: { start: startDate || "Earliest", end: endDate || "Latest" },
    openingBalance,
    closingBalance,
    totalCredits,
    totalDebits,
    totalFees,
    netChange: closingBalance - openingBalance,
    transactionCount: transactions.length,
    transactions,
  };
};
