
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown } from "lucide-react";
import { utils, writeFile } from "xlsx";
import { useToast } from "@/components/ui/use-toast";

// Dados mockados para exemplo
const mockExits = [
  { id: 1, product: "Produto 1", quantity: 5, date: "2024-03-20", reason: "Venda" },
  { id: 2, product: "Produto 2", quantity: 3, date: "2024-03-19", reason: "Devolução" },
  { id: 3, product: "Produto 3", quantity: 8, date: "2024-03-18", reason: "Venda" },
];

const StockExits = () => {
  const { toast } = useToast();

  const exportToExcel = () => {
    const ws = utils.json_to_sheet(mockExits);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Saídas");
    writeFile(wb, "saidas.xlsx");
    
    toast({
      title: "Planilha exportada com sucesso!",
      description: "O arquivo foi baixado para seu computador.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Registro de Saídas</h2>
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
              <TableHead>Motivo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockExits.map((exit) => (
              <TableRow key={exit.id} className="hover-scale">
                <TableCell>{exit.product}</TableCell>
                <TableCell>{exit.quantity}</TableCell>
                <TableCell>{exit.date}</TableCell>
                <TableCell>{exit.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockExits;
