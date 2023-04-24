
export const authPath = {
    "/users/authentication": {
        post: {
          sumary : "Authenticate User",
          description: "This route is responsible for authenticate a user.",
          tags: ["Auth"],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User"
                },
                examples: {
                  user: {
                    value: {
                      "email": "joao@example.com",
                      "password": "123"
                    }
                  }
                }
              }
            }
          },
          responses: {
            400: {
                description: "Bad Request."
              },
            404: {
              description: "User not Found."
            },
            401: {
              description: "Email and Password is necessary."
            },
            200: {
              description: "Ok",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    $ref: "#/components/schemas/User"
                  }
                }
              }
            }
          }
        }
   }
}