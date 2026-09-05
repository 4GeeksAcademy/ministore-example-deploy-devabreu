import click
from api.models import db, User, Category, Product, Order, OrderItem


def setup_commands(app):
    @app.cli.command("insert-test-users")
    @click.argument("count")
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = f"test_user{x}@test.com"
            user.set_password("123456")
            user.is_active = True
            db.session.add(user)
        db.session.commit()
        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        print("Seeding dummy data for mini-ecommerce...")

        # 1. Create or get Demo Users
        demo_user = User.query.filter_by(email="demo@tienda.com").first()
        if not demo_user:
            demo_user = User(
                email="demo@tienda.com",
                name="Carlos Demo",
                is_active=True,
                is_admin=False
            )
            demo_user.set_password("demo123")
            db.session.add(demo_user)
            print("Created demo user: demo@tienda.com / demo123")

        admin_user = User.query.filter_by(email="admin@tienda.com").first()
        if not admin_user:
            admin_user = User(
                email="admin@tienda.com",
                name="Admin Principal",
                is_active=True,
                is_admin=True
            )
            admin_user.set_password("admin123")
            db.session.add(admin_user)
            print("Created admin user: admin@tienda.com / admin123")

        db.session.commit()

        # 2. Categories
        categories_data = [
            {
                "name": "Electrónica",
                "slug": "electronics",
                "description": "Gadgets, smartphones, tablets y accesorios inteligentes.",
                "image_url": "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Audio & Sonido",
                "slug": "audio",
                "description": "Auriculares inalámbricos, altavoces y sonido de alta fidelidad.",
                "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Moda & Calzado",
                "slug": "fashion",
                "description": "Prendas contemporáneas, zapatillas urbanas y accesorios.",
                "image_url": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Hogar & Oficina",
                "slug": "home",
                "description": "Lámparas minimalistas, ergonomía y decoración práctica.",
                "image_url": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80"
            },
            {
                "name": "Deportes & Outdoor",
                "slug": "sports",
                "description": "Botellas térmicas, mochilas tácticas y equipo de entrenamiento.",
                "image_url": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
            }
        ]

        categories_map = {}
        for cat_info in categories_data:
            cat = Category.query.filter_by(slug=cat_info["slug"]).first()
            if not cat:
                cat = Category(**cat_info)
                db.session.add(cat)
                db.session.flush()
            categories_map[cat_info["slug"]] = cat

        db.session.commit()
        print(f"Verified {len(categories_map)} categories.")

        # 3. Products
        products_data = [
            # Audio
            {
                "name": "Auriculares ANC Pro Studio",
                "description": "Cancelación de ruido activa híbrida, 40h de batería ininterrumpida y conexión Bluetooth 5.3 multipunto con micrófono estéreo.",
                "price": 129.99,
                "stock": 25,
                "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
                "category_slug": "audio",
                "is_featured": True
            },
            {
                "name": "Altavoz Portátil BassPulse",
                "description": "Altavoz impermeable IPX7 con graves profundos, ecualizador dinámico y batería de 15 horas. Ideal para exteriores.",
                "price": 59.50,
                "stock": 40,
                "image_url": "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
                "category_slug": "audio",
                "is_featured": False
            },
            {
                "name": "Earbuds True Wireless AirLite",
                "description": "Auriculares ultraligeros con estuche de carga rápida USB-C y resistencia a salpicaduras para entrenamiento diario.",
                "price": 39.99,
                "stock": 50,
                "image_url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
                "category_slug": "audio",
                "is_featured": False
            },
            # Electrónica
            {
                "name": "Smartwatch ChronoFit Ultra",
                "description": "Pantalla AMOLED siempre activa, sensor SpO2, monitor de frecuencia cardíaca continua y GPS integrado de alta precisión.",
                "price": 189.00,
                "stock": 18,
                "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
                "category_slug": "electronics",
                "is_featured": True
            },
            {
                "name": "Teclado Mecánico RGB 75%",
                "description": "Switches mecánicos táctiles lubricados de fábrica, chasis de aluminio sólido y conectividad dual inalámbrica y Type-C.",
                "price": 89.90,
                "stock": 15,
                "image_url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
                "category_slug": "electronics",
                "is_featured": True
            },
            {
                "name": "Cargador Rápido GaN 65W Triple Puerto",
                "description": "Tecnología de nitruro de galio ultracompacta. Carga simultáneamente tu laptop, tablet y smartphone a máxima velocidad.",
                "price": 34.00,
                "stock": 35,
                "image_url": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80",
                "category_slug": "electronics",
                "is_featured": False
            },
            # Moda
            {
                "name": "Sudadera Minimalista Cotton Blend",
                "description": "Fabricada con 80% algodón orgánico peinado. Corte unisex relajado con acabados acanalados duraderos.",
                "price": 45.00,
                "stock": 30,
                "image_url": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
                "category_slug": "fashion",
                "is_featured": False
            },
            {
                "name": "Zapatillas Urbanas StreetGlide",
                "description": "Suela de caucho vulcanizado antideslizante con amortiguación suave. Diseño flat atemporal para cualquier ocasión.",
                "price": 79.99,
                "stock": 20,
                "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
                "category_slug": "fashion",
                "is_featured": True
            },
            {
                "name": "Gafas de Sol Polarizadas Aviator",
                "description": "Protección UV400 completa con montura metálica delgada y bisagras elásticas de confort prolongado.",
                "price": 28.50,
                "stock": 45,
                "image_url": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
                "category_slug": "fashion",
                "is_featured": False
            },
            # Hogar
            {
                "name": "Lámpara de Escritorio LED Táctil",
                "description": "Brazo flexible multidireccional, 5 niveles de brillo ajustables y 3 temperaturas de color con memoria.",
                "price": 38.00,
                "stock": 22,
                "image_url": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
                "category_slug": "home",
                "is_featured": True
            },
            {
                "name": "Cafetera Prensa Francesa Acero Inox",
                "description": "Capacidad de 1 litro con sistema de filtrado de 4 niveles para un café aromático y sin sedimentos.",
                "price": 29.90,
                "stock": 16,
                "image_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
                "category_slug": "home",
                "is_featured": False
            },
            {
                "name": "Difusor Aromaterapia Ultrasónico",
                "description": "Capacidad de 500ml con apagado automático de seguridad e iluminación LED sutil monocromática.",
                "price": 24.50,
                "stock": 28,
                "image_url": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
                "category_slug": "home",
                "is_featured": False
            },
            # Deportes
            {
                "name": "Botella Térmica Inox 750ml",
                "description": "Doble pared aislada al vacío: mantiene bebidas frías durante 24 horas o calientes durante 12 horas. Libre de BPA.",
                "price": 19.99,
                "stock": 60,
                "image_url": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
                "category_slug": "sports",
                "is_featured": True
            },
            {
                "name": "Mochila Urbana Impermeable 25L",
                "description": "Compartimento acolchado para laptop de hasta 16 pulgadas, bolsillos antirrobo y tejido resistente al desgaste.",
                "price": 54.00,
                "stock": 14,
                "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
                "category_slug": "sports",
                "is_featured": False
            },
            {
                "name": "Esterilla de Yoga Antideslizante Pro",
                "description": "Material TPE ecológico de 6mm de grosor con líneas de alineación corporal y correa de transporte incluida.",
                "price": 32.50,
                "stock": 20,
                "image_url": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80",
                "category_slug": "sports",
                "is_featured": False
            }
        ]

        for p_info in products_data:
            cat = categories_map.get(p_info["category_slug"])
            if not cat:
                continue

            existing_prod = Product.query.filter_by(
                name=p_info["name"]).first()
            if not existing_prod:
                prod = Product(
                    name=p_info["name"],
                    description=p_info["description"],
                    price=p_info["price"],
                    stock=p_info["stock"],
                    image_url=p_info["image_url"],
                    category_id=cat.id,
                    is_featured=p_info["is_featured"]
                )
                db.session.add(prod)

        db.session.commit()
        print("Verified dummy products.")

        # 4. Sample initial order for demo user
        sample_order = Order.query.filter_by(user_id=demo_user.id).first()
        if not sample_order:
            prod1 = Product.query.filter_by(
                name="Smartwatch ChronoFit Ultra").first()
            prod2 = Product.query.filter_by(
                name="Botella Térmica Inox 750ml").first()

            if prod1 and prod2:
                initial_order = Order(
                    user_id=demo_user.id,
                    total_amount=round(prod1.price + (prod2.price * 2), 2),
                    status="completed",
                    shipping_address="Av. Insurgentes Sur 1234, CDMX",
                    items=[
                        OrderItem(product_id=prod1.id, quantity=1,
                                  unit_price=prod1.price),
                        OrderItem(product_id=prod2.id, quantity=2,
                                  unit_price=prod2.price)
                    ]
                )
                db.session.add(initial_order)
                db.session.commit()
                print("Created initial sample order for demo user.")

        print("Dummy data seeding complete! Database is full and ready.")
