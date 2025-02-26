
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

const StockEntries = () => {
  const { toast } = useToast();
  const entries = useStockStore((state) => state.entries);
  const addEntry = useStockStore((state) => state.addEntry);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    product: "",
    quantity: "",
    supplier: "",
    batch: "",
    expirationDate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.product || !newEntry.quantity || !newEntry.supplier) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    addEntry({
      ...newEntry,
      quantity: parseInt(newEntry.quantity),
      date: new Date().toISOString().split('T')[0],
    });

    setNewEntry({ 
      product: "", 
      quantity: "", 
      supplier: "",
      batch: "",
      expirationDate: "",
    });
    setIsDialogOpen(false);
    
    toast({
      title: "Entrada registrada com sucesso!",
      description: "O estoque foi atualizado.",
    });
  };

  const exportToExcel = () => {
    const ws = utils.json_to_sheet(entries);
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
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="hover-scale">
                <Plus className="mr-2 h-4 w-4" />
                Nova Entrada
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Nova Entrada</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid gap-2">
                  <Label htmlFor="product">Produto *</Label>
                  <Input
                    id="product"
                    placeholder="Nome do produto"
                    value={newEntry.product}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, product: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantidade *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    placeholder="Quantidade"
                    value={newEntry.quantity}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, quantity: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="supplier">Fornecedor *</Label>
                  <Input
                    id="supplier"
                    placeholder="Nome do fornecedor"
                    value={newEntry.supplier}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, supplier: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="batch">Lote</Label>
                  <Input
                    id="batch"
                    placeholder="Número do lote"
                    value={newEntry.batch}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, batch: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expirationDate">Data de Validade</Label>
                  <Input
                    id="expirationDate"
                    type="date"
                    value={newEntry.expirationDate}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, expirationDate: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" className="w-full">
                  Registrar Entrada
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
              <TableHead>Fornecedor</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>Validade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id} className="hover-scale">
                <TableCell>{entry.product}</TableCell>
                <TableCell>{entry.quantity}</TableCell>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.supplier}</TableCell>
                <TableCell>{entry.batch || '-'}</TableCell>
                <TableCell>{entry.expirationDate || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockEntries;
