import { useCallback, useEffect, useState } from "react";

import { Box, Breadcrumbs, Button, Input, Link, Typography } from "@mui/material";

import AddBeneficiaryModal from "@/components/beneficiary/AddBeneficiaryModal";
import BeneficiaryList from "@/components/beneficiary/BeneficiaryList";
import {
  type Beneficiary,
  deleteBeneficiaryApi,
  listBeneficiariesApi,
  toggleFavoriteApi,
} from "@/services/beneficiaryApi";

export default function Page() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchBeneficiaries = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listBeneficiariesApi(search || undefined);
      setBeneficiaries(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchBeneficiaries();
  }, [fetchBeneficiaries]);

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      await toggleFavoriteApi(id, isFavorite);
      fetchBeneficiaries();
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBeneficiaryApi(id);
      fetchBeneficiaries();
    } catch {
      // ignore
    }
  };

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link underline="hover" color="inherit" href="/dashboards/default">
          Dashboard
        </Link>
        <Typography color="text.primary">Beneficiaries</Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Beneficiaries
        </Typography>
        <Button variant="contained" onClick={() => setModalOpen(true)}>
          Add Beneficiary
        </Button>
      </Box>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search beneficiaries..."
        sx={{ mb: 3, width: 320 }}
      />

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <BeneficiaryList
          beneficiaries={beneficiaries}
          onToggleFavorite={handleToggleFavorite}
          onDelete={handleDelete}
        />
      )}

      <AddBeneficiaryModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={fetchBeneficiaries} />
    </Box>
  );
}
