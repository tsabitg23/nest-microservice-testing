package routes

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/tsabitg23/go-grpc-api-gateway/pkg/auth/pb"
)

type RegisterRequestBody struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

// @Summary register user
// @Schemes
// @Description register new user for authentication
// @Tags auth
// @Accept json
// @Produce json
// @Param body body RegisterRequestBody true "Register Request"
// @Success 200 {object} pb.RegisterResponse
// @Failure 400 {object} pb.RegisterResponse
// @Router /register [post]
func Register(ctx *gin.Context, c pb.AuthServiceClient) {
	b := RegisterRequestBody{}

	if err := ctx.BindJSON(&b); err != nil {
		ctx.AbortWithError(http.StatusBadRequest, err)
		return
	}

	// if role not "admin" or "sales", throw http.StatusBadRequest
	if b.Role != "admin" && b.Role != "sales" {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"message": "Role must be 'admin' or 'sales'",
		})
		return
	}

	res, err := c.Register(context.Background(), &pb.RegisterRequest{
		Email:    b.Email,
		Password: b.Password,
		Role:     b.Role,
	})

	if err != nil {
		ctx.AbortWithError(http.StatusBadGateway, err)
		return
	}

	ctx.JSON(http.StatusCreated, &res)
}
