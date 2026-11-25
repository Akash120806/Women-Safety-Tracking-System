package in.safeway.app;
import javax.persistence.*;import java.time.LocalDateTime;
@Entity @Table(name="location_points")
public class LocationPoint {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @ManyToOne(optional=false) @JoinColumn(name="user_id") public User user;
 public double latitude; public double longitude; public double accuracy;
 public LocalDateTime recordedAt;
 public LocationPoint() {}
 public LocationPoint(User u,double a,double o,double ac){user=u;latitude=a;longitude=o;accuracy=ac;recordedAt=LocalDateTime.now();}
}
