const database = require('../database');

class Question {
    constructor(id, category, question, correctAnswer, answerOne, answerTwo, answerThree, active) {
        this.id = id;
        this.category = category;
        this.question = question;
        this.correctAnswer = correctAnswer;
        this.answerOne = answerOne;
        this.answerTwo = answerTwo;
        this.answerThree = answerThree;
        this.active = active;
    }

    static async getAll() {
        const data = await database.selectAll('questions');
        const response = [];
        data.forEach((r) => {
            response.push(new Question(r));
        });
        return response;
    }

    static async get(questionId) {
        const data = await database.singleSelect('questions', questionId);
        return data;
    }

    static async create({category, question, correct_answer, answer_one, answer_two, answer_three}){
      let response = await database.insert('questions', {category, question, correct_answer, answer_one, answer_two, answer_three});

      const id = response.insertId;
      if (id > 0){
        return new Question({id, category, question, correct_answer, answer_one, answer_two, answer_three});
      }
      return [];
    }

    static async changeActive(questionId) {
        const data = await database.changeActive('questions', questionId);
        return data;
    }

    static async changeCategory(questionId, category) {
        const data = await database.changeCategory('questions', questionId, category);
        return data;
    }

    static async modify(questionId, {category, question, correct_answer, answer_one, answer_two, answer_three}) {
        const data = await database.update('questions', questionId, {category, question, correct_answer, answer_one, answer_two, answer_three} );
        return data;
    }
}

module.exports = Question;