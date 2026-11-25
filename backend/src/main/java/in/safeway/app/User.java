package in.safeway.app;
import javax.persistence.*;
@Entity @Table(name="app_users")
public class User {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @Column(nullable=false) public String name;
 @Column(nullable=false,unique=true) public String email;
 @Column(nullable=false) public String password;
 public User() {}
 public User(String n,String e,String p){name=n;email=e;password=p;}
}
