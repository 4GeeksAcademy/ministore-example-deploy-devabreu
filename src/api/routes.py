"""
API Routes for Mini E-Commerce
Includes Auth, Categories, Products, and Orders endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from api.models import db, User, Category, Product, Order, OrderItem

api = Blueprint('api', __name__)
CORS(api)


# ==========================================
# AUTH ENDPOINTS
# ==========================================

@api.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()
    name = data.get("name", "").strip()

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    if len(password) < 6:
        return jsonify({"message": "Password must be at least 6 characters long"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"message": "A user with this email already exists"}), 409

    new_user = User(
        email=email,
        name=name if name else email.split('@')[0],
        is_active=True,
        is_admin=False
    )
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=str(new_user.id))
    return jsonify({
        "message": "User registered successfully",
        "token": access_token,
        "user": new_user.serialize()
    }), 201


@api.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid email or password"}), 401

    if not user.is_active:
        return jsonify({"message": "User account is disabled"}), 403

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "user": user.serialize()
    }), 200


@api.route('/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "user": user.serialize()
    }), 200


# ==========================================
# CATALOG ENDPOINTS (CATEGORIES & PRODUCTS)
# ==========================================

@api.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.order_by(Category.name.asc()).all()
    return jsonify([c.serialize() for c in categories]), 200


@api.route('/products', methods=['GET'])
def get_products():
    category_id = request.args.get('category_id', type=int)
    search = request.args.get('search', type=str)
    featured = request.args.get('featured', type=str)

    query = Product.query

    if category_id:
        query = query.filter(Product.category_id == category_id)

    if featured is not None and featured.lower() in ['true', '1']:
        query = query.filter(Product.is_featured.is_(True))

    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            (Product.name.ilike(search_pattern)) |
            (Product.description.ilike(search_pattern))
        )

    products = query.order_by(Product.id.desc()).all()
    return jsonify([p.serialize() for p in products]), 200


@api.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = db.session.get(Product, product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404

    return jsonify(product.serialize()), 200


# ==========================================
# ORDER ENDPOINTS
# ==========================================

@api.route('/orders', methods=['POST'])
@jwt_required()
def create_order():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()
    if not data or not data.get("items"):
        return jsonify({"message": "Cart items are required to create an order"}), 400

    items_data = data.get("items")
    shipping_address = data.get(
        "shipping_address", "").strip() or "Standard Delivery"

    total_amount = 0.0
    order_items_to_create = []

    for item in items_data:
        product_id = item.get("product_id") or item.get("id")
        qty = int(item.get("quantity", 1))

        if qty <= 0:
            continue

        product = db.session.get(Product, product_id)
        if not product:
            return jsonify({"message": f"Product with ID {product_id} not found"}), 404

        if product.stock < qty:
            return jsonify({
                "message": f"Insufficient stock for '{product.name}'. Available: {product.stock}"
            }), 400

        # Decrement stock
        product.stock -= qty
        subtotal = round(float(product.price) * qty, 2)
        total_amount += subtotal

        order_item = OrderItem(
            product_id=product.id,
            quantity=qty,
            unit_price=product.price
        )
        order_items_to_create.append(order_item)

    if not order_items_to_create:
        return jsonify({"message": "No valid items in the order"}), 400

    new_order = Order(
        user_id=user.id,
        total_amount=round(total_amount, 2),
        status="completed",
        shipping_address=shipping_address,
        items=order_items_to_create
    )

    db.session.add(new_order)
    db.session.commit()

    return jsonify({
        "message": "Order placed successfully",
        "order": new_order.serialize()
    }), 201


@api.route('/orders', methods=['GET'])
@jwt_required()
def get_my_orders():
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=int(user_id)).order_by(
        Order.created_at.desc()).all()
    return jsonify([o.serialize() for o in orders]), 200


# ==========================================
# ADMIN BACKOFFICE API ENDPOINTS (/api/admin/...)
# ==========================================

def _is_admin_user(user_id):
    user = db.session.get(User, int(user_id))
    return user is not None and user.is_admin


@api.route('/admin/orders', methods=['GET'])
@jwt_required()
def get_all_orders_admin():
    user_id = get_jwt_identity()
    if not _is_admin_user(user_id):
        return jsonify({"message": "Acceso denegado: se requieren privilegios de administrador"}), 403

    orders = Order.query.order_by(Order.created_at.desc()).all()
    results = []
    for o in orders:
        data = o.serialize()
        data["customer_email"] = o.user.email if o.user else "Sin correo"
        data["customer_name"] = o.user.name if o.user else "Cliente"
        results.append(data)

    return jsonify(results), 200


@api.route('/admin/orders/<int:order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status_admin(order_id):
    user_id = get_jwt_identity()
    if not _is_admin_user(user_id):
        return jsonify({"message": "Acceso denegado: se requieren privilegios de administrador"}), 403

    order = db.session.get(Order, order_id)
    if not order:
        return jsonify({"message": "Pedido no encontrado"}), 404

    data = request.get_json() or {}
    new_status = data.get("status", "").strip().lower()
    valid_statuses = ["pending", "shipped", "completed", "cancelled"]

    if new_status not in valid_statuses:
        return jsonify({"message": f"Estado no válido. Opciones: {', '.join(valid_statuses)}"}), 400

    order.status = new_status
    db.session.commit()
    return jsonify({
        "message": f"Estado del pedido actualizado a '{new_status}'",
        "order": order.serialize()
    }), 200


@api.route('/admin/products', methods=['POST'])
@jwt_required()
def create_product_admin():
    user_id = get_jwt_identity()
    if not _is_admin_user(user_id):
        return jsonify({"message": "Acceso denegado: se requieren privilegios de administrador"}), 403

    data = request.get_json() or {}
    name = data.get("name", "").strip()
    price = data.get("price")
    category_id = data.get("category_id")

    if not name or price is None or not category_id:
        return jsonify({"message": "Nombre, precio y categoría son obligatorios"}), 400

    new_product = Product(
        name=name,
        price=float(price),
        category_id=int(category_id),
        stock=int(data.get("stock", 10)),
        description=data.get("description", "").strip(),
        image_url=data.get("image_url", "").strip(
        ) or "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
        is_featured=bool(data.get("is_featured", False))
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({
        "message": "Producto creado exitosamente",
        "product": new_product.serialize()
    }), 201


@api.route('/admin/products/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product_admin(product_id):
    user_id = get_jwt_identity()
    if not _is_admin_user(user_id):
        return jsonify({"message": "Acceso denegado: se requieren privilegios de administrador"}), 403

    product = db.session.get(Product, product_id)
    if not product:
        return jsonify({"message": "Producto no encontrado"}), 404

    data = request.get_json() or {}
    if "stock" in data:
        product.stock = max(0, int(data["stock"]))
    if "price" in data:
        product.price = max(0.01, float(data["price"]))
    if "is_featured" in data:
        product.is_featured = bool(data["is_featured"])
    if "name" in data and data["name"].strip():
        product.name = data["name"].strip()
    if "description" in data:
        product.description = data["description"].strip()
    if "image_url" in data and data["image_url"].strip():
        product.image_url = data["image_url"].strip()
    if "category_id" in data:
        product.category_id = int(data["category_id"])

    db.session.commit()
    return jsonify({
        "message": "Producto actualizado exitosamente",
        "product": product.serialize()
    }), 200
