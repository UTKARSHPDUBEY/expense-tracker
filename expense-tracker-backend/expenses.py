from flask import request,Blueprint
from db import get_connection
from utils import error_response,success_response
from auth import token_required

expenses_bp=Blueprint("expenses",__name__)




@expenses_bp.route('/',methods=['POST'])
@token_required
def add_expense(current_user):
    data=request.json
    if not data:
        return error_response("No data available",400)
    amount=data.get("amount")
    category=data.get("category")
    description=data.get("description")
    expense_datetime=data.get("expense_datetime")
    if (amount==None) or not category or not expense_datetime:
        return error_response("No data available",400)
    try:
        amount=float(amount)
    except ValueError:
        return error_response("Amount should be number",400)
    user_id=current_user["user_id"]
    con=get_connection()
    if not con:
        return error_response("Database connection failed",500)
    cursor=None
    try:
        cursor=con.cursor()
        query = "INSERT INTO expenses (user_id,amount, category, description, expense_datetime) VALUES (%s,%s, %s, %s,%s)"
        values = (user_id,amount, category, description, expense_datetime)
        cursor.execute(query, values)
        con.commit()
        new_expense_id = cursor.lastrowid
        return success_response("Expense added successfully",{
            "expense_id": new_expense_id,
            "amount": amount,
            "category": category,
            "description": description,
            "expense_datetime": expense_datetime},201)
    except Exception as e:
        return error_response("Internal server error",500)
    finally:
        if cursor:
            cursor.close()
        if con:
            con.close()
    



@expenses_bp.route('/',methods=['GET'])
@token_required
def get_expenses(current_user):
    user_id=current_user["user_id"]
    con=get_connection()
    if not con:
        return error_response("Database connection failed",500)
    cursor=None
    try:
        cursor=con.cursor(dictionary=True)
        query = "Select * from expenses where user_id=%s"
        values = (user_id,)
        cursor.execute(query, values)
        row=cursor.fetchall()
        return success_response("expense info",row,200)
    except Exception as e:
        return error_response("Internal server error", 500)
    finally:
        if cursor:
            cursor.close()
        if con:
            con.close()



@expenses_bp.route('/<int:expense_id>', methods=['PUT'])
@token_required
def update_expense(current_user, expense_id):
    data = request.json
    if not data:
        return error_response("No data provided", 400)

    amount = data.get("amount")
    category = data.get("category")
    description = data.get("description")
    expense_datetime = data.get("expense_datetime")

    if amount is None and category is None and description is None and expense_datetime is None:
        return error_response("No fields provided for update", 400)

    if amount is not None:
        try:
            amount = float(amount)
        except (ValueError, TypeError):
            return error_response("Amount must be a number", 400)

    update_fields = []
    values = []

    if amount is not None:
        update_fields.append("amount = %s")
        values.append(amount)

    if category is not None:
        update_fields.append("category = %s")
        values.append(category)

    if description is not None:
        update_fields.append("description = %s")
        values.append(description)

    if expense_datetime is not None:
        update_fields.append("expense_datetime = %s")
        values.append(expense_datetime)

    set_clause = ", ".join(update_fields)

    user_id = current_user["user_id"]

    query = f"""
        UPDATE expenses
        SET {set_clause}
        WHERE id = %s AND user_id = %s
    """

    values.append(expense_id)
    values.append(user_id)
    con = get_connection()
    if not con:
        return error_response("Database connection failed", 500)

    cursor = None
    try:
        cursor = con.cursor()
        cursor.execute(query, tuple(values))
        con.commit()

        if cursor.rowcount == 0:
            return error_response( "Expense not found", 404)

        return success_response("Expense updated successfully")

    except Exception:
        return error_response("Internal server error", 500)

    finally:
        if cursor:
            cursor.close()
        if con:
            con.close()




@expenses_bp.route('/<int:expense_id>', methods=['DELETE'])
@token_required
def delete_expense(current_user, expense_id):
    user_id=current_user["user_id"]
    con = get_connection()
    if not con:
        return error_response("Database connection failed", 500)
    cursor = None
    try:
        cursor = con.cursor()
        query="DELETE from expenses where id=%s and user_id=%s"
        values=(expense_id,user_id)
        cursor.execute(query, values)
        con.commit()

        if cursor.rowcount == 0:
            return error_response( "Expense not found", 404)

        return success_response("Expense deleted successfully")

    except Exception:
        return error_response("Internal server error", 500)

    finally:
        if cursor:
            cursor.close()
        if con:
            con.close()
    