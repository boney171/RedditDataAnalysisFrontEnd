from django.http import HttpResponse
import mysql.connector
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json


@csrf_exempt  # Exempt from CSRF token for testing purposes only
@require_http_methods(["POST"])  # Only allow POST requests
def index(request):
    # Parse the JSON body of the POST request
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    search_term = body.get('searchValue', 'Air force')  # Default to 'Air force' if searchTerm is not provided
    #print(body_unicode)
    # Set up the database connection
    db_connection = mysql.connector.connect(user="group7", password="group7pass")
    db_cursor = db_connection.cursor()
    db_cursor.execute("USE cs179g;")
    db_cursor = db_connection.cursor()

    # Parameterized query to prevent SQL injection
    query = """
        SELECT *
        FROM whole_df2
        WHERE title LIKE %s OR text_body LIKE %s
        ORDER BY polarity DESC
        LIMIT 4
    """
    #title LIKE %s OR  WHERE text_body LIKE %s
    like_pattern = f'%{search_term}%'
    db_cursor.execute(query, (like_pattern,like_pattern,))

    result = db_cursor.fetchall()
    #print(result)
    # Close the database connection
    db_cursor.close()
    db_connection.close()

    # Convert the result to a list of dictionaries for JSON serialization
    result_list = [{
        'author': row[1],
        'date': row[2],
        'num_comments': row[3],
        'up_vote': row[4],
        'text_body': row[5],
        'title': row[6],
        'score': row[4],
        'interactiveness_score': row[10],
        'polarity': row[9],
        # Add more columns as needed
    } for row in result]
    print(result_list)
    # Return the data as a JSON response
    return JsonResponse({'result': result_list})

@csrf_exempt  # Exempt from CSRF token for testing purposes only
@require_http_methods(["POST"])  # Only allow POST requests
def graph(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    

    category = body.get('category')
    insight = body.get('insight')
    time_period = body.get('time_period')


    db_connection = mysql.connector.connect(user="group7", password="group7pass")
    db_cursor = db_connection.cursor()
    db_cursor.execute("USE cs179g;")
    db_cursor = db_connection.cursor()

    fQuery = f"""
    SELECT date, {insight} 
    FROM average_insights4 
    WHERE category = {category}
    AND date BETWEEN {time_period}
    ORDER BY date
    """
    print(fQuery)
    db_cursor.execute(fQuery)
    result = db_cursor.fetchall()

    # Close the database connection
    db_cursor.close()
    db_connection.close()

    # Convert the result to a list of dictionaries for JSON serialization
    if(insight == 'Polarity'): 
        result_list = [{
            'date': row[0],
            'polarity': row[1],
            # Add more columns as needed
        } for row in result]
    elif(insight == 'score'):
        result_list = [{
            'date': row[0],
            'score': row[1],
            # Add more columns as needed
        } for row in result]
    elif(insight == 'num_comments'):
         result_list = [{
            'date': row[0],
            'num_comments': row[1],
            # Add more columns as needed
        } for row in result]
    print(result_list)
    # Return the data as a JSON response
    return JsonResponse({'result': result_list})



@csrf_exempt  # Exempt from CSRF token for testing purposes only
@require_http_methods(["POST"])  # Only allow POST requests
def average(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    
    print(body)
    category = body.get('category')
    time_period = body.get('time_period')

    db_connection = mysql.connector.connect(user="group7", password="group7pass")
    db_cursor = db_connection.cursor()
    db_cursor.execute("USE cs179g;")

    formatted_query = f"""
        SELECT AVG(avg_polarity), AVG(avg_score), AVG(avg_num_comments)
        FROM averages3
        WHERE date BETWEEN {time_period}
        AND category = {category}
    """

    #print(formatted_query)

    # Execute the query
    db_cursor.execute(formatted_query)
    result = db_cursor.fetchall()

    db_cursor.close()
    db_connection.close()

    result_list = [{
        'polarity': row[0],
        'score': row[1],
        'comments': row[2],
    } for row in result]

    #print(result_list)
    return JsonResponse({'result': result_list})


@csrf_exempt  # Exempt from CSRF token for testing purposes only
@require_http_methods(["POST"])  # Only allow POST requests
def insights(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    searchValue = body.get('searchValue')  

    db_connection = mysql.connector.connect(user="group7", password="group7pass")
    db_cursor = db_connection.cursor()
    db_cursor.execute("USE cs179g;")
    db_cursor = db_connection.cursor()

    query = """
        SELECT AVG(Polarity), AVG(score), AVG(num_comments), AVG(interactiveness_score)
        FROM whole_df2
        WHERE title LIKE %s OR text_body LIKE %s
    """

    like_pattern = f'%{searchValue}%'
    db_cursor.execute(query, (like_pattern,like_pattern,))

    result = db_cursor.fetchall()

    #print(result)
    # Close the database connection
    db_cursor.close()
    db_connection.close()

    # Convert the result to a list of dictionaries for JSON serialization
    result_list = [{
        'Polarity': row[0],
        'score': row[1],
        'num_comments': row[2],
        'interactiveness_score': row[3],
        # Add more columns as needed
    } for row in result]

    # Return the data as a JSON response
    return JsonResponse({'result': result_list})
