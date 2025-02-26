
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown } from "lucide-react";
import { utils, writeFile } from "xlsx";
import { useToast } from "@/components/ui/use-toast";

// Dados mockados para exemplo
const mockProducts = [
  { id: 1, name: "Produto 1", quantity: 50, minStock: 10, category: "Categoria A" },
  { id: 2, name: "Produto 2", quantity: 30, minStock: 15, category: "Categoria B" },
  { id: 3, name: "Produto 3", quantity: 75, minStock: 20, category: "Categoria A" },
];

const StockOverview = () => {
  const { toast } = useToast();

  const exportToExcel = () => {
    const ws = utils.json_to_sheet(mockProducts);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Estoque");
    writeFile(wb, "estoque.xlsx");
    
    toast({
      title: "Planilha exportada com sucesso!",
      description: "O arquivo foi baixado para seu computador.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Produtos em Estoque</h2>
        <Button onClick={exportToExcel} className="hover-scale">
          <FileDown className="mr-2 h-4 w-4" />
          Exportar Planilha
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Estoque Mínimo</TableHead>
              <TableHead>Categoria</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockProducts.map((product) => (
              <TableRow key={product.id} className="hover-scale">
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.minStock}</TableCell>
                <TableCell>{product.category}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockOverview;
