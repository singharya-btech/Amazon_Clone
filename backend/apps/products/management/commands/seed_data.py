"""
Seed command: python manage.py seed_data
Populates the database with sample categories and products using real Unsplash images.
"""
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from apps.products.models import Category, Product, ProductImage
import random


CATEGORIES = [
    {'name': 'Electronics', 'slug': 'electronics'},
    {'name': 'Mobile Phones', 'slug': 'mobile-phones'},
    {'name': 'Laptops', 'slug': 'laptops'},
    {'name': 'Fashion', 'slug': 'fashion'},
    {'name': 'Books', 'slug': 'books'},
    {'name': 'Home Essentials', 'slug': 'home-essentials'},
    {'name': 'Kitchen', 'slug': 'kitchen'},
    {'name': 'Gaming', 'slug': 'gaming'},
]

PRODUCTS = [
    # Electronics
    {
        'name': 'Sony WH-1000XM5 Wireless Headphones',
        'category': 'electronics',
        'price': 24990.00, 'original_price': 34990.00,
        'brand': 'Sony', 'stock': 50,
        'image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        'description': 'Industry-leading noise canceling with Dual Noise Sensor technology. Next-level music with 30-hour battery life.',
        'is_featured': True, 'is_best_seller': True,
        'specifications': {'Battery': '30 hours', 'Connectivity': 'Bluetooth 5.2', 'Weight': '250g'},
    },
    {
        'name': 'Apple AirPods Pro (2nd Gen)',
        'category': 'electronics',
        'price': 18990.00, 'original_price': 24990.00,
        'brand': 'Apple', 'stock': 80,
        'image_url': 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500',
        'description': 'Active Noise Cancellation, Adaptive Transparency, and Personalized Spatial Audio.',
        'is_featured': True, 'is_best_seller': True,
        'specifications': {'Battery': '6 hours', 'Connectivity': 'Bluetooth 5.3', 'Water Resistance': 'IPX4'},
    },
    {
        'name': 'Samsung 65" 4K QLED Smart TV',
        'category': 'electronics',
        'price': 79990.00, 'original_price': 119990.00,
        'brand': 'Samsung', 'stock': 20,
        'image_url': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500',
        'description': 'Quantum Dot technology delivers brilliant color. Neo Quantum Processor 4K.',
        'is_featured': True,
        'specifications': {'Resolution': '4K UHD', 'HDR': 'Quantum HDR', 'Smart TV': 'Tizen OS'},
    },
    {
        'name': 'Canon EOS R50 Mirrorless Camera',
        'category': 'electronics',
        'price': 59990.00, 'original_price': 69990.00,
        'brand': 'Canon', 'stock': 15,
        'image_url': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
        'description': '24.2MP APS-C CMOS sensor. 4K video recording. Dual Pixel CMOS AF II.',
        'is_featured': False,
        'specifications': {'Megapixels': '24.2MP', 'Video': '4K 30fps', 'AF Points': '651'},
    },
    # Mobile Phones
    {
        'name': 'iPhone 15 Pro Max 256GB',
        'category': 'mobile-phones',
        'price': 119900.00, 'original_price': 129900.00,
        'brand': 'Apple', 'stock': 45,
        'image_url': 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
        'description': 'A17 Pro chip. Titanium design. 48MP main camera with 5x optical zoom.',
        'is_featured': True, 'is_best_seller': True,
        'specifications': {'Chip': 'A17 Pro', 'Storage': '256GB', 'Camera': '48MP', 'Display': '6.7" Super Retina XDR'},
    },
    {
        'name': 'Samsung Galaxy S24 Ultra',
        'category': 'mobile-phones',
        'price': 109999.00, 'original_price': 129999.00,
        'brand': 'Samsung', 'stock': 35,
        'image_url': 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
        'description': 'Galaxy AI. 200MP camera. Built-in S Pen. Snapdragon 8 Gen 3.',
        'is_featured': True, 'is_best_seller': True,
        'specifications': {'Processor': 'Snapdragon 8 Gen 3', 'Camera': '200MP', 'Battery': '5000mAh', 'Display': '6.8" Dynamic AMOLED'},
    },
    {
        'name': 'Google Pixel 8 Pro',
        'category': 'mobile-phones',
        'price': 79999.00, 'original_price': 99999.00,
        'brand': 'Google', 'stock': 25,
        'image_url': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500',
        'description': 'Google Tensor G3 chip. Best-in-class camera with AI features.',
        'is_featured': False,
        'specifications': {'Processor': 'Tensor G3', 'Camera': '50MP', 'Battery': '5050mAh', 'Display': '6.7" LTPO OLED'},
    },
    {
        'name': 'OnePlus 12 5G',
        'category': 'mobile-phones',
        'price': 64999.00, 'original_price': 79999.00,
        'brand': 'OnePlus', 'stock': 30,
        'image_url': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        'description': 'Snapdragon 8 Gen 3. 100W SUPERVOOC charging. Hasselblad camera.',
        'is_featured': False,
        'specifications': {'Processor': 'Snapdragon 8 Gen 3', 'Charging': '100W', 'Battery': '5400mAh'},
    },
    # Laptops
    {
        'name': 'MacBook Pro 14" M3 Pro',
        'category': 'laptops',
        'price': 169900.00, 'original_price': 199900.00,
        'brand': 'Apple', 'stock': 20,
        'image_url': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        'description': 'M3 Pro chip. 18GB unified memory. 18-hour battery life. Liquid Retina XDR display.',
        'is_featured': True, 'is_best_seller': True,
        'specifications': {'Chip': 'M3 Pro', 'RAM': '18GB', 'Storage': '512GB SSD', 'Display': '14.2" Liquid Retina XDR'},
    },
    {
        'name': 'Dell XPS 15 OLED',
        'category': 'laptops',
        'price': 139990.00, 'original_price': 169990.00,
        'brand': 'Dell', 'stock': 15,
        'image_url': 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500',
        'description': 'Intel Core i7-13700H. NVIDIA RTX 4060. 15.6" OLED display.',
        'is_featured': True,
        'specifications': {'Processor': 'Intel i7-13700H', 'GPU': 'RTX 4060', 'RAM': '16GB', 'Display': '15.6" OLED'},
    },
    {
        'name': 'ASUS ROG Zephyrus G14',
        'category': 'laptops',
        'price': 119990.00, 'original_price': 149990.00,
        'brand': 'ASUS', 'stock': 18,
        'image_url': 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500',
        'description': 'AMD Ryzen 9 7940HS. RTX 4060. 14" QHD+ 165Hz display.',
        'is_featured': False, 'is_best_seller': True,
        'specifications': {'Processor': 'Ryzen 9 7940HS', 'GPU': 'RTX 4060', 'RAM': '16GB', 'Display': '14" QHD+ 165Hz'},
    },
    {
        'name': 'Lenovo ThinkPad X1 Carbon',
        'category': 'laptops',
        'price': 109990.00, 'original_price': 139990.00,
        'brand': 'Lenovo', 'stock': 22,
        'image_url': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
        'description': 'Intel Core i7-1365U. 14" IPS display. Military-grade durability.',
        'is_featured': False,
        'specifications': {'Processor': 'Intel i7-1365U', 'RAM': '16GB', 'Weight': '1.12kg', 'Battery': '57Wh'},
    },
    # Fashion
    {
        'name': "Levi's 501 Original Jeans",
        'category': 'fashion',
        'price': 4999.00, 'original_price': 6999.00,
        'brand': "Levi's", 'stock': 100,
        'image_url': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
        'description': 'The original blue jean since 1873. Straight fit with button fly.',
        'is_featured': True, 'is_best_seller': True,
        'specifications': {'Fit': 'Straight', 'Material': '100% Cotton', 'Closure': 'Button Fly'},
    },
    {
        'name': 'Nike Air Max 270',
        'category': 'fashion',
        'price': 10999.00, 'original_price': 13999.00,
        'brand': 'Nike', 'stock': 75,
        'image_url': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        'description': 'Max Air unit in the heel for all-day comfort. Breathable mesh upper.',
        'is_featured': True, 'is_best_seller': True,
        'specifications': {'Type': 'Running', 'Sole': 'Rubber', 'Upper': 'Mesh'},
    },
    {
        'name': 'Adidas Ultraboost 23',
        'category': 'fashion',
        'price': 12999.00, 'original_price': 16999.00,
        'brand': 'Adidas', 'stock': 60,
        'image_url': 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500',
        'description': 'BOOST midsole for incredible energy return. Primeknit+ upper.',
        'is_featured': False,
        'specifications': {'Type': 'Running', 'Midsole': 'BOOST', 'Upper': 'Primeknit+'},
    },
    {
        'name': 'H&M Classic Cotton T-Shirt',
        'category': 'fashion',
        'price': 1499.00, 'original_price': 2499.00,
        'brand': 'H&M', 'stock': 120,
        'image_url': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        'description': 'Everyday essential cotton t-shirt in a clean, classic cut. Machine washable.',
        'is_featured': True,
        'specifications': {'Material': '100% Cotton', 'Fit': 'Regular', 'Sleeve': 'Short'},
    },
    # Books
    {
        'name': 'Atomic Habits by James Clear',
        'category': 'books',
        'price': 999.00, 'original_price': 1799.00,
        'brand': 'Penguin', 'stock': 200,
        'image_url': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
        'description': 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.',
        'is_featured': True, 'is_best_seller': True,
        'specifications': {'Pages': '320', 'Language': 'English', 'Format': 'Paperback'},
    },
    {
        'name': 'The Psychology of Money',
        'category': 'books',
        'price': 899.00, 'original_price': 1499.00,
        'brand': 'Harriman House', 'stock': 150,
        'image_url': 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500',
        'description': 'Timeless lessons on wealth, greed, and happiness by Morgan Housel.',
        'is_featured': True,
        'specifications': {'Pages': '256', 'Language': 'English', 'Format': 'Paperback'},
    },
    # Home Essentials
    {
        'name': 'Dyson V15 Detect Vacuum',
        'category': 'home-essentials',
        'price': 49990.00, 'original_price': 69990.00,
        'brand': 'Dyson', 'stock': 30,
        'image_url': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500',
        'description': 'Laser detects invisible dust. Acoustic piezo sensor counts and sizes particles.',
        'is_featured': True, 'is_best_seller': True,
        'specifications': {'Battery': '60 min', 'Suction': '230 AW', 'Weight': '3.1kg'},
    },
    {
        'name': 'Philips Hue Smart Bulb Starter Kit',
        'category': 'home-essentials',
        'price': 7999.00, 'original_price': 9999.00,
        'brand': 'Philips', 'stock': 80,
        'image_url': 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=500',
        'description': '16 million colors. Works with Alexa, Google Assistant, Apple HomeKit.',
        'is_featured': False,
        'specifications': {'Bulbs': '3x A19', 'Colors': '16 million', 'Connectivity': 'Zigbee'},
    },
    {
        'name': 'Nest Learning Thermostat',
        'category': 'home-essentials',
        'price': 19999.00, 'original_price': 24999.00,
        'brand': 'Google Nest', 'stock': 25,
        'image_url': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500',
        'description': 'Smart thermostat that learns your schedule and adjusts temperature automatically.',
        'is_featured': True,
        'specifications': {'Connectivity': 'Wi-Fi', 'Compatibility': '95% of 24V systems', 'Energy Savings': 'Up to 15%'},
    },
    # Kitchen
    {
        'name': 'Instant Pot Duo 7-in-1',
        'category': 'kitchen',
        'price': 9999.00, 'original_price': 12999.00,
        'brand': 'Instant Pot', 'stock': 60,
        'image_url': 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=500',
        'description': 'Pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker, warmer.',
        'is_featured': True, 'is_best_seller': True,
        'specifications': {'Capacity': '6 Quart', 'Functions': '7-in-1', 'Material': 'Stainless Steel'},
    },
    {
        'name': 'KitchenAid Stand Mixer',
        'category': 'kitchen',
        'price': 34999.00, 'original_price': 44999.00,
        'brand': 'KitchenAid', 'stock': 25,
        'image_url': 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=500',
        'description': '5-quart stainless steel bowl. 10 speeds. Tilt-head design.',
        'is_featured': True,
        'specifications': {'Capacity': '5 Quart', 'Speeds': '10', 'Wattage': '325W'},
    },
    {
        'name': 'Breville Barista Espresso Machine',
        'category': 'kitchen',
        'price': 59999.00, 'original_price': 74999.00,
        'brand': 'Breville', 'stock': 15,
        'image_url': 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
        'description': 'Barista-quality espresso with integrated conical burr grinder and steam wand.',
        'is_featured': False, 'is_best_seller': True,
        'specifications': {'Boiler': '1610W Thermocoil', 'Grinder': 'Conical Burr', 'Pressure': '9 bar'},
    },
    # Gaming
    {
        'name': 'PlayStation 5 Console',
        'category': 'gaming',
        'price': 54999.00, 'original_price': 54999.00,
        'brand': 'Sony', 'stock': 10,
        'image_url': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500',
        'description': 'Experience lightning-fast loading with an ultra-high speed SSD.',
        'is_featured': True, 'is_best_seller': True,
        'specifications': {'CPU': 'AMD Zen 2', 'GPU': 'AMD RDNA 2', 'Storage': '825GB SSD', 'Resolution': '4K'},
    },
    {
        'name': 'Xbox Series X',
        'category': 'gaming',
        'price': 54999.00, 'original_price': 54999.00,
        'brand': 'Microsoft', 'stock': 12,
        'image_url': 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500',
        'description': 'The fastest, most powerful Xbox ever. 12 teraflops of processing power.',
        'is_featured': True,
        'specifications': {'CPU': 'AMD Zen 2', 'GPU': '12 TFLOPS', 'Storage': '1TB NVMe SSD', 'Resolution': '4K 120fps'},
    },
    {
        'name': 'Razer DeathAdder V3 Gaming Mouse',
        'category': 'gaming',
        'price': 6999.00, 'original_price': 8999.00,
        'brand': 'Razer', 'stock': 90,
        'image_url': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
        'description': 'Focus Pro 30K Optical Sensor. 90-hour battery life. Ultra-lightweight 63g.',
        'is_featured': False, 'is_best_seller': True,
        'specifications': {'Sensor': 'Focus Pro 30K', 'Battery': '90 hours', 'Weight': '63g', 'DPI': '30,000'},
    },
]


class Command(BaseCommand):
    help = 'Seed database with sample categories and products'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding categories...')
        category_map = {}
        for cat_data in CATEGORIES:
            cat, _ = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults={'name': cat_data['name'], 'is_active': True}
            )
            category_map[cat_data['slug']] = cat

        self.stdout.write('Seeding products...')
        for i, p in enumerate(PRODUCTS):
            slug = slugify(p['name'])
            sku = f"SKU-{slug[:20].upper()}-{i:03d}"
            product, _ = Product.objects.update_or_create(
                slug=slug,
                defaults={
                    'name': p['name'],
                    'category': category_map[p['category']],
                    'price': p['price'],
                    'original_price': p.get('original_price'),
                    'brand': p['brand'],
                    'stock': p['stock'],
                    'image_url': p['image_url'],
                    'description': p['description'],
                    'is_featured': p.get('is_featured', False),
                    'is_best_seller': p.get('is_best_seller', False),
                    'specifications': p.get('specifications', {}),
                    'sku': sku,
                    'is_active': True,
                }
            )
            ProductImage.objects.get_or_create(
                product=product,
                is_primary=True,
                defaults={'image_url': p['image_url'], 'order': 0}
            )

        self.stdout.write(self.style.SUCCESS(
            f'Successfully seeded {len(CATEGORIES)} categories and {len(PRODUCTS)} products.'
        ))