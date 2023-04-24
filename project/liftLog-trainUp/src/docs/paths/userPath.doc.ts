export const userPath = {
    "/users": {
        post: {
          sumary: "Create User",
          description: "Route to create an user",
          tags: ["Users"],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User"
                },
                examples: {
                  user: {
                    value: {
                      "name": "Arthur Spitz",
                      "email": "arthurspitz@example.com",
                      "password": "123456"
                    }
                  }
                }
              }
            }
          },
          responses: {
            404: {
              description: "Email already registered"
            },
            401: {
              description: "Name, Email and Password are required."
            },
            201: {
              description: "User created",
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
        },
        get: {
          sumary: "Get all users",
          description: "Route to get all users",
          tags: ["Users"],
          security: [{ "bearerAuth": [] }],
          responses: {
            404: {
              description: "No users registered."
            },
            401: {
                description: "Unauthorized."
              },
              400: {
                description: "Bad Request."
              },
            200: {
              description: "Ok",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    items: {
                      $ref: "#/components/schemas/User"
                    }
                  }
                }
            }
          }
        }
    },
      put: {
         sumary: "Update logged user",
        description: "Responsible for update the logged user",
        tags: ["Users"],
        security: [{ "bearerAuth": [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User"
              },
              examples: {
                "Update user": {
                  "value": {
                    "name": "Arthur Fitz",
                    "email": "arthurfitz@example.com",
                    "password": "123456"
                  }
                },
                "Update user email": {
                  "value": {
                    "email": "arthurfitz@example.com"
                  }
                },
                "Update user password": {
                  "value": {
                    "password": "654321"
                  }
                },
                "Update user nameame": {
                  "value": {
                    "name": "Arthur Fitz"
                  }
                }
              }
            }
          }
        },
        responses: {
          400: {
            "description": "Just allowed: |Name |Email |Password"
          },
          404: {
            "description": "Email already registered."
          },
          200: {
            description: "User updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  items: {
                    $ref: "#/components/schemas/User"
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        sumary: "Delete logged user",
        description: "Responsible to delete the logged user",
        tags: ["Users"],
        security: [{ "bearerAuth": [] }],
        responses: {
          400: {
            description: "User wasn't delete"
          },
      
          200: {
            description: "The user was deleted"
          }
        }
    },
      "/users/user": {
        get: {
          sumary: "Get logged user information",
          description: "This route is responsible for get logged user information",
          tags: ["User"],
          security: [{ "bearerAuth": [] }],
          responses: {
            404: {
              "description": "User not found."
            },
            200: {
              description: "Ok",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    items: {
                      $ref: "#/components/schemas/User"
                    }
                  }
                }
              }
            }
          }
        }
    }
}
}