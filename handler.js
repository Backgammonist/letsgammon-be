'use strict';

const uuid = require('uuid')
const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.addMatch = (event, context, callback) => {
  const timestamp = new Date().getTime()
  const data = JSON.parse(event.body)
  const validationError = 'Input failed validation' 

  // data validation
  // property missing
  if (!data['playerId'] ||
    !data['oppoentEmail'] ||
    !data['playerWind'] ||
    !data['matchScore']) {
      callback(new Error(validationError))
  }
  // todo: type validation

  const params = {
    TableName: 'matches',
    Item: {
      id: uuid.v1(),
      player: data.playerId,
      opponent_email: data['opponentEmail'],
      player_wins: data['playerWins'],
      match_score: data['matchScore'],
      createdAt: timestamp,
      updatedAt: timestamp,
    }
  }

  dynamoDb.put(params, (err, res) => {
    if (err) {
      console.error(err)
      callback(new Error(`Couldn't create item`))
      return
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(res.Item)
    }

    callback(null, response)
  })
};
