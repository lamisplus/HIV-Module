package org.lamisplus.modules.hiv.apiError;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Setter
@Getter
public class ApiError extends RuntimeException {

    private HttpStatus status;
    private String message;

    public ApiError(HttpStatus status, String message) {
        super();
        this.status = status;
        this.message = message;
    }

    public ApiError(String message) {
        super(message);
    }

    public ApiError(String message, Throwable cause) {
        super(message, cause);
    }

}
