
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown } from "lucide-react";
import { utils, writeFile } from "xlsx";
import { useToast } from "@/components/ui/use-toast";
import { useStockStore } from "@/stores/useStockStore";

const StockOverview = () => {
  const { toast } = useToast();
  const products = useStockStore((state) => state.products);

  const exportToExcel = () => {
    const ws = utils.json_to_sheet(products);
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
              <TableHead>Código</TableHead>
              <TableHead>Nome do Produto</TableHead>
              <TableHead>Quantidade em Estoque</TableHead>
              <TableHead>Estoque Mínimo</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>Validade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="hover-scale">
                <TableCell>{product.code}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell className={product.quantity <= product.minStock ? "text-destructive" : ""}>
                  {product.quantity}
                </TableCell>
                <TableCell>{product.minStock}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.batch || '-'}</TableCell>
                <TableCell>{product.expirationDate || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockOverview;
