package in.safeway.app;
import javax.persistence.*;import java.time.LocalDateTime;
@Entity @Table(name="sos_alerts")
public class SosAlert {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @ManyToOne(optional=false) @JoinColumn(name="user_id") public User user;
 public String message; public LocalDateTime createdAt; public String status;
 public SosAlert() {}
 public SosAlert(User u,String m){user=u;message=m;createdAt=LocalDateTime.now();status="CREATED";}
}
