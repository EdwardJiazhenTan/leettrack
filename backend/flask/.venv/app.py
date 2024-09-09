import requests
from flask import Flask, request, jsonify
from db_connect import get_db_connection
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

#fetch_leetcode_stats function is used to fetch the data from the external API  
def fetch_leetcode_stats(username):
    """Fetches LeetCode statistics for a given username from the external API."""
    try:
        # Ensure the URL is constructed properly with the username
        url = f"https://leetcode-stats-api.herokuapp.com/{username}"
        response = requests.get(url, timeout=10)  # Including a timeout is a good practice
        if response.status_code == 200:
            return response.json()  # Return the parsed JSON data
        else:
            print(f"Error fetching data: Status code {response.status_code}")
            return None
    except requests.exceptions.RequestException as e:
        # This will catch any network-related errors, including failure to connect
        print(f"Failed to connect to the API: {e}")
        return None

# The create_user route is used to create a new user in the database
@app.route("/users/create", methods=["POST"])
def create_user():
    username = request.json.get('username')
    if not username:
        return jsonify({"error": "Username is required"}), 400

    stats = fetch_leetcode_stats(username)
    if not stats:
        return jsonify({"error": "Failed to retrieve user stats"}), 404

    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = connection.cursor()
        # Assuming 'totalSolved' and 'ranking' are fields returned by the LeetCode stats API
        # You will need to map these correctly based on the actual API response
        total_solved = stats.get('totalSolved', 0)
        ranking = stats.get('ranking', 'Not Ranked')

        cursor.execute("INSERT INTO Users (userName, Total_solve, UserRank) VALUES (%s, %s, %s)",
                       (username, total_solved, ranking))
        connection.commit()
        return jsonify({"success": "User created successfully", "username": username}), 201
    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route("/users")
def get_users():
    connection = get_db_connection()
    if connection is not None:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Users")
        users = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(users)
    else:
        return "<p>Database connection failed. 3</p>"

@app.route("/users/<int:user_id>")
def get_user_by_id(user_id):
    connection = get_db_connection()
    if connection is not None:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Users WHERE ID = %s", (user_id,))
        user = cursor.fetchone()
        cursor.close()
        connection.close()
        if user:
            return jsonify(user)
        else:
            return jsonify({"error": "User not found"}), 404

@app.route("/Questions")
def get_questions():
    connection = get_db_connection()
    if connection is not None:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Questions")
        Questions = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(Questions)
    else:
        return "<p>Database connection failed. </p>"
      
@app.route("/Questions/id/<int:question_id>")
def get_question_by_id(question_id):
    connection = get_db_connection()
    if connection is not None:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Questions WHERE ID = %s", (question_id,))
        question = cursor.fetchone()  # fetchone() as we are expecting only one record
        cursor.close()
        connection.close()
        if question:
            return jsonify(question)
        else:
            return jsonify({"error": "Question not found"}), 404
    else:
        return "<p>Database connection failed.</p>"
      
@app.route("/Questions/topic/<string:topic>")
def get_question_by_topic(topic):
    connection = get_db_connection()
    if connection is not None:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Questions WHERE Topic = %s", (topic,))
        question = cursor.fetchall()
        cursor.close()
        connection.close()
        if question:
            return jsonify(question)
        else:
            return jsonify({"error": "Question not found"}), 404
    else:
        return "<p>Database connection failed.</p>"
      
@app.route("/Questions/difficulty/<string:difficulty>")
def get_question_by_difficulty(difficulty):
    connection = get_db_connection()
    if connection is not None:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Questions WHERE Difficulty = %s", (difficulty,))
        question = cursor.fetchall()
        cursor.close()
        connection.close()
        if question:
            return jsonify(question)
        else:
            return jsonify({"error": "Question not found"}), 404
    else:
        return "<p>Database connection failed.</p>"

@app.route("/Path")
def get_path():
    connection = get_db_connection()
    if connection is not None:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Path")
        Path = cursor.fetchall()
        cursor.close()
        connection.close()
        return jsonify(Path)
    else:
        return "<p>Database connection failed. 3</p>"
      
def get_path_by_id(path_id):
    connection = get_db_connection()
    if connection is not None:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Path WHERE ID = %s", (path_id,))
        path = cursor.fetchone()  # fetchone() as we are expecting only one record
        cursor.close()
        connection.close()
        if path:
            return jsonify(path)
        else:
            return jsonify({"error": "Path not found"}), 404
    else:
        return "<p>Database connection failed.</p>"
      
@app.route("/Path", methods=["POST"])
def create_path():
    data = request.json
    pathID = data.get('pathID')
    pathName = data.get('pathName')
    if not all([pathID, pathName]):
        return jsonify({"error": "Missing pathID or pathName"}), 400
    return create_path(pathID, pathName)  # Assuming _create_path is defined and works as in your snippet

@app.route("/Path/<int:path_id>", methods=["PUT"])
def update_path(path_id):
    data = request.json
    pathName = data.get('pathName')
    if not pathName:
        return jsonify({"error": "Missing pathName"}), 400
    return update_path(path_id, pathName)  # Assuming _update_path is defined and works as in your snippet

@app.route("/Path/<int:path_id>", methods=["DELETE"])
def delete_path(path_id):
    return delete_path(path_id)  # Assuming _delete_path is defined and works as in your snippet
      
@app.route("/PathQuestions/<int:path_id>")
def get_questions_by_path(path_id):
    connection = get_db_connection()
    if connection is not None:
        cursor = connection.cursor(dictionary=True)
        try:
            # SQL to join PathQuestions with Questions on the question ID
            query = """
            SELECT pq.PQIndex, pq.PID, q.ID, q.Link, q.Difficulty, q.Topic 
            FROM PathQuestions pq
            JOIN Questions q ON pq.QID = q.ID
            WHERE pq.PID = %s
            ORDER BY pq.PQIndex;
            """
            cursor.execute(query, (path_id,))
            path_questions = cursor.fetchall()
            if path_questions:
                return jsonify(path_questions)
            else:
                return jsonify({"error": "No questions found for this path"}), 404
        finally:
            cursor.close()
            connection.close()
    else:
        return "<p>Database connection failed.</p>"
      
@app.route("/PathQuestions/add", methods=["POST"])
def add_path_question():
    data = request.json
    # Extract necessary data from request
    pid = data.get('PID')
    qid = data.get('QID')
    pqindex = data.get('PQIndex')  # This might be optional

    # Validate incoming data
    if not pid or not qid:
        return jsonify({"error": "Missing required PID or QID"}), 400

    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = connection.cursor()
        # Insert new path question
        cursor.execute(
            "INSERT INTO PathQuestions (PQIndex, QID, PID) VALUES (%s, %s, %s)",
            (pqindex, qid, pid)
        )
        connection.commit()
        return jsonify({"success": "Path question added successfully", "PID": pid, "QID": qid, "PQIndex": pqindex}), 201
    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()
        
@app.route('/status', methods=['POST'])
def create_status():
    data = request.json
    userName = data.get('UserName')
    questionID = data.get('QuestionID')
    need_review = data.get('Need_review', False)  # Default to False if not provided

    if not userName or not questionID:
        return jsonify({'error': 'Missing UserName or QuestionID'}), 400

    connection = get_db_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO Status (UserName, QuestionID, Need_review) VALUES (%s, %s, %s)",
            (userName, questionID, need_review)
        )
        connection.commit()
        return jsonify({'success': 'Status created successfully'}), 201
    except Exception as e:
        connection.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@app.route('/status', methods=['GET'])
def get_status():
    userName = request.args.get('UserName')
    questionID = request.args.get('QuestionID')
    if not userName or not questionID:
        return jsonify({'error': 'Missing UserName or QuestionID'}), 400

    connection = get_db_connection()
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM Status WHERE UserName = %s AND QuestionID = %s",
            (userName, questionID)
        )
        status = cursor.fetchone()
        return jsonify(status if status else {'error': 'Status not found'}), 200 if status else 404
    finally:
        cursor.close()
        connection.close()

@app.route('/status', methods=['PUT'])
def update_status():
    data = request.json
    userName = data.get('UserName')
    questionID = data.get('QuestionID')
    need_review = data.get('Need_review')

    if not userName or not questionID:
        return jsonify({'error': 'Missing UserName or QuestionID'}), 400

    connection = get_db_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(
            "UPDATE Status SET Need_review = %s WHERE UserName = %s AND QuestionID = %s",
            (need_review, userName, questionID)
        )
        connection.commit()
        return jsonify({'success': 'Status updated successfully'}), 200
    finally:
        cursor.close()
        connection.close()

@app.route('/status', methods=['DELETE'])
def delete_status():
    userName = request.args.get('UserName')
    questionID = request.args.get('QuestionID')
    if not userName or not questionID:
        return jsonify({'error': 'Missing UserName or QuestionID'}), 400

    connection = get_db_connection()
    try:
        cursor = connection.cursor()
        cursor.execute(
            "DELETE FROM Status WHERE UserName = %s AND QuestionID = %s",
            (userName, questionID)
        )
        connection.commit()
        return jsonify({'success': 'Status deleted successfully'}), 200
    finally:
        cursor.close()
        connection.close()
        
@app.route('/status/review/<username>', methods=['GET'])
def get_review_questions(username):
    connection = get_db_connection()
    if connection is None:
        return jsonify({"error": "Database connection failed"}), 500

    try:
        cursor = connection.cursor(dictionary=True)
        # First, get all QuestionIDs for this user where Need_review is true
        cursor.execute("""
            SELECT q.ID, q.Link, q.Difficulty, q.Topic
            FROM Status s
            JOIN Questions q ON s.QuestionID = q.ID
            WHERE s.UserName = %s AND s.Need_review = TRUE
        """, (username,))
        questions = cursor.fetchall()
        if not questions:
            return jsonify({"error": "No review needed questions found"}), 404
        return jsonify(questions)
    finally:
        cursor.close()
        connection.close()

if __name__ == "__main__":
    app.run(debug=True)
