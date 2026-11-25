package in.safeway.app;
import org.springframework.stereotype.Component;import org.springframework.web.filter.OncePerRequestFilter;import javax.servlet.*;import javax.servlet.http.*;import java.io.IOException;import org.springframework.security.core.context.SecurityContextHolder;import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;import java.util.Collections;
@Component public class JwtFilter extends OncePerRequestFilter {
 private final JwtUtil jwt; public JwtFilter(JwtUtil j){jwt=j;}
 @Override protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException{
  String h=req.getHeader("Authorization");if(h!=null&&h.startsWith("Bearer ")){try{String email=jwt.email(h.substring(7));SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(email,null,Collections.emptyList()));}catch(Exception ex){SecurityContextHolder.clearContext();}}
  chain.doFilter(req,res);
 }
}
