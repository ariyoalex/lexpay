import type { GridRowsProp } from "@mui/x-data-grid";

const randomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export const randomCreatedDate = () => randomDate(new Date(2020, 0, 1), new Date());
export const randomUpdatedDate = () => randomDate(new Date(2023, 0, 1), new Date());
export const randomId = () => Math.random().toString(36).substring(2, 10);

const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas"];
const movieNames = ["The Shawshank Redemption", "The Godfather", "The Dark Knight", "12 Angry Men", "Schindler's List", "Pulp Fiction", "The Lord of the Rings", "Forrest Gump", "Inception", "Fight Club", "Goodfellas", "The Matrix", "Interstellar", "Parasite", "Coco", "Dune"];

const companyNames = ["TechCorp", "Innovate Inc", "DataFlow", "CloudBase", "NexGen", "AlphaByte", "QuantumSoft", "Pinnacle Systems", "Horizon Tech", "Stellar Solutions"];

export const randomTraderName = () => {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${first} ${last}`;
};

export const randomEmail = () => {
  const name = randomTraderName().toLowerCase().replace(" ", ".");
  const domains = ["example.com", "mail.com", "test.org", "demo.net"];
  return `${name}@${domains[Math.floor(Math.random() * domains.length)]}`;
};

export const randomArrayItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
export const randomPrice = (min: number, max: number) => Math.round((Math.random() * (max - min) + min) * 100) / 100;
export const randomCurrency = () => randomArrayItem(["USD", "EUR", "GBP", "JPY", "BRL"]);
export const randomCountry = () => randomArrayItem(["USA", "Canada", "France", "Germany", "Brazil", "Japan", "Australia", "UK"]);
export const randomCity = () => randomArrayItem(["New York", "Toronto", "Paris", "Berlin", "São Paulo", "Tokyo", "Sydney", "London"]);
export const randomAddress = () => `${randomInt(100, 9999)} ${randomArrayItem(["Main St", "Oak Ave", "Elm St", "Park Blvd", "Broadway", "1st Ave"])}`;
export const randomUserName = () => {
  const name = randomTraderName().toLowerCase().replace(" ", "");
  return `@${name}${randomInt(10, 99)}`;
};
const commodities = ["Corn", "Wheat", "Soybeans", "Coffee", "Sugar", "Cotton", "Rice", "Oats", "Barley", "Gold", "Silver", "Copper", "Oil", "Gas", "Cocoa"];
export const randomCommodity = () => randomArrayItem(commodities);

export interface UseDemoDataOptions {
  dataSet?: "Employee" | "Commodity";
  rowLength?: number;
  maxColumns?: number;
  visibleFields?: string[];
}

export const useDemoData = ({ dataSet: _dataSet = "Employee", rowLength = 100 }: UseDemoDataOptions) => {
  const rows: GridRowsProp = Array.from({ length: rowLength }, (_, i) => ({
    id: i + 1,
    name: randomTraderName(),
    email: randomEmail(),
    position: randomArrayItem(["Developer", "Designer", "Manager", "Analyst", "Engineer", "Lead", "Director"]),
    company: randomArrayItem(companyNames),
    salary: Math.floor(Math.random() * 150000) + 50000,
    startDate: randomCreatedDate().toISOString().split("T")[0],
    updatedDate: randomUpdatedDate().toISOString().split("T")[0],
    status: randomArrayItem(["Active", "Inactive", "On Leave", "Terminated"]),
  }));

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", width: 180 },
    { field: "email", headerName: "Email", width: 220 },
    { field: "position", headerName: "Position", width: 160 },
    { field: "company", headerName: "Company", width: 160 },
    { field: "salary", headerName: "Salary", type: "number" as const, width: 120 },
    { field: "startDate", headerName: "Start Date", width: 120 },
    { field: "status", headerName: "Status", width: 120 },
  ];

  return { data: { rows, columns } };
};

export const useMovieData = () => {
  const rows: GridRowsProp = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: movieNames[i % movieNames.length],
    year: Math.floor(Math.random() * 30) + 1990,
    rating: Math.floor(Math.random() * 50) / 10 + 5,
    director: randomTraderName(),
    gross: Math.floor(Math.random() * 900) + 100,
    company: randomArrayItem(companyNames),
  }));

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "title", headerName: "Title", width: 250 },
    { field: "year", headerName: "Year", type: "number" as const, width: 100 },
    { field: "rating", headerName: "Rating", type: "number" as const, width: 100 },
    { field: "director", headerName: "Director", width: 200 },
    { field: "gross", headerName: "Gross ($M)", type: "number" as const, width: 120 },
  ];

  return { data: { rows, columns } };
};
