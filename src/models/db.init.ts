import { pool } from '../config/db';
import { PRODUCTS, DEALERS, BLOGS, CERTIFICATES } from '../data/seedData';

export const initNeonDatabase = async (): Promise<void> => {
  console.log('⚡ Checking & Initializing Neon Cloud PostgreSQL Tables...');
  let client;
  try {
    client = await pool.connect();

    // 1. Products Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        sku VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        summary TEXT,
        description TEXT,
        target_animals TEXT[],
        is_featured BOOLEAN DEFAULT false,
        is_bestseller BOOLEAN DEFAULT false,
        image TEXT,
        variants TEXT[],
        benefits TEXT[],
        ingredients JSONB,
        dosage TEXT,
        diseases TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Dealers Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS dealers (
        id VARCHAR(50) PRIMARY KEY,
        firm_name VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(100),
        district VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'APPROVED',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Enquiries Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(100),
        district VARCHAR(100),
        state VARCHAR(100),
        subject VARCHAR(255),
        message TEXT,
        product_id VARCHAR(50),
        status VARCHAR(50) DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Blogs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        excerpt TEXT,
        content TEXT,
        cover_image TEXT,
        category VARCHAR(100),
        date VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Certificates Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        issued_by VARCHAR(255) NOT NULL,
        image_url TEXT NOT NULL
      );
    `);

    // Check if products need seeding
    const prodCountRes = await client.query('SELECT COUNT(*) FROM products');
    const prodCount = parseInt(prodCountRes.rows[0].count, 10);

    if (prodCount === 0) {
      console.log('🌾 Seeding initial veterinary catalog into Neon DB products table...');
      for (const prod of PRODUCTS) {
        await client.query(`
          INSERT INTO products (id, title, slug, sku, category, summary, description, target_animals, is_featured, is_bestseller, image, variants, benefits, ingredients, dosage, diseases)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          ON CONFLICT (id) DO NOTHING;
        `, [
          prod.id,
          prod.title,
          prod.slug,
          prod.sku,
          prod.category,
          prod.summary,
          prod.description,
          prod.targetAnimals,
          prod.isFeatured || false,
          prod.isBestSeller || false,
          prod.image,
          prod.variants,
          prod.benefits,
          JSON.stringify(prod.ingredients),
          prod.dosage,
          prod.diseases || []
        ]);
      }
      console.log(`✅ Seeded ${PRODUCTS.length} products to Neon PostgreSQL!`);
    }

    // Check dealers seeding
    const dealerCountRes = await client.query('SELECT COUNT(*) FROM dealers');
    if (parseInt(dealerCountRes.rows[0].count, 10) === 0) {
      for (const dlr of DEALERS) {
        await client.query(`
          INSERT INTO dealers (id, firm_name, contact_name, phone, email, district, state, address, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO NOTHING;
        `, [
          dlr.id,
          dlr.firmName,
          dlr.contactName,
          dlr.phone,
          dlr.email,
          dlr.district,
          dlr.state,
          dlr.address,
          dlr.status
        ]);
      }
      console.log(`✅ Seeded ${DEALERS.length} dealers to Neon PostgreSQL!`);
    }

    // Check blogs seeding
    const blogCountRes = await client.query('SELECT COUNT(*) FROM blogs');
    if (parseInt(blogCountRes.rows[0].count, 10) === 0) {
      for (const blog of BLOGS) {
        await client.query(`
          INSERT INTO blogs (id, title, slug, excerpt, content, cover_image, category, date)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING;
        `, [
          blog.id,
          blog.title,
          blog.slug,
          blog.excerpt,
          blog.content,
          blog.coverImage,
          blog.category,
          blog.date
        ]);
      }
      console.log(`✅ Seeded ${BLOGS.length} blogs to Neon PostgreSQL!`);
    }

    // Check certificates seeding
    const certCountRes = await client.query('SELECT COUNT(*) FROM certificates');
    if (parseInt(certCountRes.rows[0].count, 10) === 0) {
      for (const cert of CERTIFICATES) {
        await client.query(`
          INSERT INTO certificates (id, title, issued_by, image_url)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (id) DO NOTHING;
        `, [cert.id, cert.title, cert.issuedBy, cert.imageUrl]);
      }
      console.log(`✅ Seeded ${CERTIFICATES.length} certificates to Neon PostgreSQL!`);
    }

    console.log('🚀 Neon Database Schema & Tables Verified & Ready!');
  } catch (error: any) {
    console.warn('⚠️ Auto-schema init note:', error.message);
  } finally {
    if (client) {
      client.release();
    }
  }
};

if (process.argv[1] && (process.argv[1].includes('db.init') || process.argv[1].endsWith('db.init.ts'))) {
  initNeonDatabase()
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

