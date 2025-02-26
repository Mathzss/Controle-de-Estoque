
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import StockOverview from "@/components/stock/StockOverview";
import StockEntries from "@/components/stock/StockEntries";
import StockExits from "@/components/stock/StockExits";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center mb-8 fade-in">
          <h1 className="text-4xl font-semibold text-foreground mb-2">
            Controle de Estoque
          </h1>
          <p className="text-muted-foreground">
            Gerencie seu estoque de forma simples e eficiente
          </p>
        </header>

        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full fade-in"
        >
          <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto mb-6">
            <TabsTrigger value="overview" className="tab-transition">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="entries" className="tab-transition">
              Entradas
            </TabsTrigger>
            <TabsTrigger value="exits" className="tab-transition">
              Saídas
            </TabsTrigger>
          </TabsList>

          <Card className="p-6">
            <TabsContent value="overview" className="mt-0 fade-in">
              <StockOverview />
            </TabsContent>
            <TabsContent value="entries" className="mt-0 fade-in">
              <StockEntries />
            </TabsContent>
            <TabsContent value="exits" className="mt-0 fade-in">
              <StockExits />
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
