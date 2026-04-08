from flask import request,Blueprint
from db import get_connection
from utils import error_response,success_response
from auth import token_required




summary_bp=Blueprint("summary_bp",__name__)


@summary_bp.route("/monthly",methods=['GET','OPTIONS'])
@token_required
def get_monthly_summary(current_user):
    user_id=current_user["user_id"]
    months=request.args.get("month")
    if not months:
        return error_response("No month provided", 400)
    if len(months)!=7:
        return error_response("Invalid month format", 400)
    parts=months.split("-")
    year=parts[0]
    month=parts[1]
    con=get_connection()
    if not con:
        return error_response("Database connection failed",500)
    cursor=None
    try:
        cursor=con.cursor(dictionary=True)
        query = "Select sum(amount) as total from expenses where user_id=%s and month(expense_datetime)=%s and year(expense_datetime)=%s"
        values = (user_id,month,year)
        cursor.execute(query, values)
        row=cursor.fetchone()
        if row["total"] is None:
            return success_response("monthly summary",{
                "month":months,
                "expense": 0}, 200)
        return success_response("monthly summary",{
        "month":months,
        "expense":row["total"]
        },200)
    except Exception as e:
        return error_response("Internal server error", 500)
    finally:
        if cursor:
            cursor.close()
        if con:
            con.close()




@summary_bp.route("/category",methods=['GET','OPTIONS'])
@token_required
def get_category_summary(current_user):
    user_id=current_user["user_id"]
    months=request.args.get("month")
    update_fields = []
    values = []
    update_fields.append("user_id=%s")
    values.append(user_id)
    if months:
        if len(months)!=7:
            return error_response("Invalid month format", 400)
        parts=months.split("-")
        year=parts[0]
        month=parts[1]
        if year is not None:
            update_fields.append("year(expense_datetime) = %s")
            values.append(year)
        if month is not None:
            update_fields.append("month(expense_datetime) = %s")
            values.append(month)
    where_clause = " and ".join(update_fields)
    con=get_connection()
    if not con:
        return error_response("Database connection failed",500)
    cursor=None
    try:
        cursor=con.cursor(dictionary=True)
        query = f"Select category,sum(amount) as total from expenses where {where_clause} group by category"
        cursor.execute(query, tuple(values))
        row=cursor.fetchall()
        if not row:
            return success_response("Category summary",[], 200)
        return success_response("Category summary",row,200)
    except Exception as e:
        return error_response("Internal server error", 500)
    finally:
        if cursor:
            cursor.close()
        if con:
            con.close()