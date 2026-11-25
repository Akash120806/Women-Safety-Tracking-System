package in.safeway.app;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * Small signed bearer-token helper implemented with the Java 8 standard library.
 * This avoids an additional JWT dependency for the academic prototype.
 */
@Component
public class JwtUtil {
    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-ms}")
    private long expiry;

    public String create(String email) {
        long expiresAt = System.currentTimeMillis() + expiry;
        String payload = email + "\n" + expiresAt;
        String encodedPayload = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        return encodedPayload + "." + sign(encodedPayload);
    }

    public String email(String token) {
        if (token == null) {
            throw new IllegalArgumentException("Missing bearer token");
        }
        String[] parts = token.split("\\.", -1);
        if (parts.length != 2 || !constantTimeEquals(sign(parts[0]), parts[1])) {
            throw new IllegalArgumentException("Invalid bearer token");
        }
        String payload = new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8);
        String[] values = payload.split("\\n", -1);
        if (values.length != 2) {
            throw new IllegalArgumentException("Invalid bearer token payload");
        }
        long expiresAt = Long.parseLong(values[1]);
        if (System.currentTimeMillis() > expiresAt) {
            throw new IllegalArgumentException("Bearer token expired");
        }
        return values[0];
    }

    private String sign(String value) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] signature = mac.doFinal(value.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(signature);
        } catch (Exception ex) {
            throw new IllegalStateException("Could not sign authentication token", ex);
        }
    }

    private boolean constantTimeEquals(String a, String b) {
        return java.security.MessageDigest.isEqual(
                a.getBytes(StandardCharsets.UTF_8), b.getBytes(StandardCharsets.UTF_8));
    }
}
