import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown, Plus } from "lucide-react";
import { utils, writeFile } from "xlsx";
import { useToast } from "@/components/ui/use-toast";
import { useStockStore } from "@/stores/useStockStore";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StockExits = () => {
  const { toast } = useToast();
  const exits = useStockStore((state) => state.exits);
  const addExit = useStockStore((state) => state.addExit);
  const products = useStockStore((state) => state.products);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newExit, setNewExit] = useState({
    product: "",
    quantity: "",
    reason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExit.product || !newExit.quantity || !newExit.reason) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    const product = products.find((p) => p.name === newExit.product);
    const quantity = parseInt(newExit.quantity);

    if (!product) {
      toast({
        title: "Erro",
        description: "Produto não encontrado no estoque",
        variant: "destructive",
      });
      return;
    }

    if (product.quantity < quantity) {
      toast({
        title: "Erro",
        description: "Quantidade insuficiente em estoque",
        variant: "destructive",
      });
      return;
    }

    addExit({
      ...newExit,
      quantity,
      date: new Date().toISOString().split('T')[0],
    });

    setNewExit({ product: "", quantity: "", reason: "" });
    setIsDialogOpen(false);
    
    toast({
      title: "Saída registrada com sucesso!",
      description: "O estoque foi atualizado.",
    });
  };

  const exportToExcel = () => {
    const ws = utils.json_to_sheet(exits);
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
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="hover-scale">
                <Plus className="mr-2 h-4 w-4" />
                Nova Saída
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Nova Saída</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid gap-2">
                  <Label htmlFor="product">Produto</Label>
                  <Select
                    value={newExit.product}
                    onValueChange={(value) =>
                      setNewExit({ ...newExit, product: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.name}>
                          {product.name} ({product.quantity} em estoque)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    placeholder="Quantidade"
                    value={newExit.quantity}
                    onChange={(e) =>
                      setNewExit({ ...newExit, quantity: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reason">Motivo</Label>
                  <Select
                    value={newExit.reason}
                    onValueChange={(value) =>
                      setNewExit({ ...newExit, reason: value })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Venda">Venda</SelectItem>
                      <SelectItem value="Devolução">Devolução</SelectItem>
                      <SelectItem value="Perda">Perda</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Registrar Saída
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Button onClick={exportToExcel} variant="outline" className="hover-scale">
            <FileDown className="mr-2 h-4 w-4" />
            Exportar Planilha
          </Button>
        </div>
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
            {exits.map((exit) => (
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
