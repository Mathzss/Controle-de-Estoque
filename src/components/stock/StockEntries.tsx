
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown } from "lucide-react";
import { utils, writeFile } from "xlsx";
import { useToast } from "@/components/ui/use-toast";

// Dados mockados para exemplo
const mockEntries = [
  { id: 1, product: "Produto 1", quantity: 20, date: "2024-03-20", supplier: "Fornecedor A" },
  { id: 2, product: "Produto 2", quantity: 15, date: "2024-03-19", supplier: "Fornecedor B" },
  { id: 3, product: "Produto 3", quantity: 30, date: "2024-03-18", supplier: "Fornecedor A" },
];

const StockEntries = () => {
  const { toast } = useToast();

  const exportToExcel = () => {
    const ws = utils.json_to_sheet(mockEntries);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Entradas");
    writeFile(wb, "entradas.xlsx");
    
    toast({
      title: "Planilha exportada com sucesso!",
      description: "O arquivo foi baixado para seu computador.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Registro de Entradas</h2>
        <Button onClick={exportToExcel} className="hover-scale">
          <FileDown className="mr-2 h-4 w-4" />
          Exportar Planilha
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Fornecedor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockEntries.map((entry) => (
              <TableRow key={entry.id} className="hover-scale">
                <TableCell>{entry.product}</TableCell>
                <TableCell>{entry.quantity}</TableCell>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.supplier}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockEntries;
