package in.safeway.app;
import javax.persistence.*;
@Entity @Table(name="trusted_contacts", uniqueConstraints=@UniqueConstraint(columnNames={"owner_id","contact_id"}))
public class TrustedContact {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @ManyToOne(optional=false) @JoinColumn(name="owner_id") public User owner;
 @ManyToOne(optional=false) @JoinColumn(name="contact_id") public User contact;
 @Column(nullable=false) public String status;
 public TrustedContact() {}
 public TrustedContact(User a,User b){owner=a;contact=b;status="PENDING";}
}
