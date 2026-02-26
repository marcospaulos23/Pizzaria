import { useState } from "react";
import { useMenu } from "@/contexts/MenuContext";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, ArrowLeft, Loader2, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminMenuPage = () => {
    const { categories, pizzasSalgadas, pizzasDoces, calzones, bebidas, combos, isLoading, error } = useMenu();
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleDeleteProduct = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja excluir "${name}"?`)) return;

        setIsDeleting(id);
        try {
            const { error } = await supabase.from("products").delete().eq("id", id);
            if (error) throw error;

            toast({
                title: "Produto removido",
                description: `O produto "${name}" foi excluído com sucesso.`,
            });
        } catch (err: any) {
            toast({
                title: "Erro ao excluir",
                description: err.message,
                variant: "destructive",
            });
        } finally {
            setIsDeleting(null);
        }
    };

    const getProductsForCategory = (categoryId: string) => {
        const allProducts = [...pizzasSalgadas, ...pizzasDoces, ...calzones, ...bebidas];
        return allProducts.filter(p => {
            // Note: the hook useMenuData already groups them, but here we might need to filter by raw category_id if we have it
            // In our MenuItem type, category is a string label. Let's find the one that matches.
            const cat = categories.find(c => c.id === categoryId);
            return p.category === cat?.label;
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="bg-secondary p-6 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link to="/admin/pedidos" className="flex items-center gap-2 text-white hover:opacity-80">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Painel Admin</span>
                    </Link>
                    <h1 className="font-display text-2xl font-bold text-white">Gerenciar Cardápio</h1>
                    <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Plus className="w-4 h-4 mr-2" /> Novo Produto
                    </Button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-6 space-y-8">
                {categories.map((category) => (
                    <section key={category.id} className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                                <span>{category.icon}</span> {category.label}
                            </h2>
                            <span className="text-muted-foreground text-sm">
                                {getProductsForCategory(category.id).length} itens
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {getProductsForCategory(category.id).map((product) => (
                                <div key={product.id} className="bg-card border rounded-xl overflow-hidden flex flex-col shadow-sm transition-hover hover:shadow-md">
                                    <div className="relative h-40 bg-muted">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="w-10 h-10 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg">{product.name}</h3>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive"
                                                    onClick={() => handleDeleteProduct(product.id, product.name)}
                                                    disabled={isDeleting === product.id}
                                                >
                                                    {isDeleting === product.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{product.description}</p>
                                        <div className="mt-auto pt-2 border-t flex flex-wrap gap-2">
                                            {product.prices.map((p, idx) => (
                                                <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                                                    {p.size}: R${p.price.toFixed(2)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {getProductsForCategory(category.id).length === 0 && (
                                <div className="col-span-full py-8 text-center border-2 border-dashed rounded-xl text-muted-foreground">
                                    Nenhum produto cadastrado nesta categoria.
                                </div>
                            )}
                        </div>
                    </section>
                ))}

                <section className="space-y-4 pt-8">
                    <div className="flex items-center justify-between border-b pb-2">
                        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                            <span>🎁</span> Combos
                        </h2>
                        <span className="text-muted-foreground text-sm">{combos.length} itens</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {combos.map((combo) => (
                            <div key={combo.id} className="bg-card border rounded-xl overflow-hidden flex flex-col shadow-sm">
                                <div className="relative h-40 bg-muted">
                                    <img src={combo.image} alt={combo.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg">{combo.name}</h3>
                                        <div className="flex gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500"><Edit className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">{combo.description}</p>
                                    <p className="mt-auto font-bold text-secondary text-xl">R$ {combo.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminMenuPage;
