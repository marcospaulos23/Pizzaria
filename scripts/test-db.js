
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Carregar variáveis do .env
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Erro: Variáveis de ambiente VITE_SUPABASE_URL ou VITE_SUPABASE_PUBLISHABLE_KEY não encontradas.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
    console.log("--- Testando Conexão Supabase ---");
    console.log(`URL: ${SUPABASE_URL}`);

    try {
        // Testar tabela de categorias
        const { data: categories, error: catError } = await supabase
            .from('categories')
            .select('*')
            .order('display_order');

        if (catError) throw catError;
        console.log(`✅ Categorias encontradas: ${categories.length}`);
        categories.forEach(c => console.log(`   - ${c.label} (${c.id})`));

        // Testar tabela de produtos
        const { data: products, error: prodError } = await supabase
            .from('products')
            .select('*')
            .limit(5);

        if (prodError) throw prodError;
        console.log(`✅ Produtos encontrados (amostra de 5): ${products.length}`);
        products.forEach(p => console.log(`   - ${p.name}`));

        // Testar tabela de preços
        const { count, error: priceError } = await supabase
            .from('product_prices')
            .select('*', { count: 'exact', head: true });

        if (priceError) throw priceError;
        console.log(`✅ Total de preços cadastrados: ${count}`);

        console.log("\n--- Resultado da Verificação ---");
        console.log("A conexão com o banco de dados e a estrutura de tabelas parecem estar corretas!");

    } catch (err) {
        console.error("❌ Erro durante o teste:");
        console.error(err.message);
        process.exit(1);
    }
}

testConnection();
