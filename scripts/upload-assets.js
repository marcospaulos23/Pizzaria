import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const assetsDir = path.join(__dirname, '../src/assets');
const bucketName = 'product-images';

async function uploadFiles() {
    const files = fs.readdirSync(assetsDir);

    for (const file of files) {
        const filePath = path.join(assetsDir, file);
        if (fs.lstatSync(filePath).isDirectory()) continue;

        console.log(`Uploading ${file}...`);
        const fileBuffer = fs.readFileSync(filePath);

        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(file, fileBuffer, {
                upsert: true,
                contentType: file.endsWith('.png') ? 'image/png' : 'image/jpeg'
            });

        if (error) {
            console.error(`Error uploading ${file}:`, error.message);
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(file);

            console.log(`Successfully uploaded ${file}. Public URL: ${publicUrl}`);
        }
    }
}

uploadFiles();
