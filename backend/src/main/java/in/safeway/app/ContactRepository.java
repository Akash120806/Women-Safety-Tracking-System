package in.safeway.app;import org.springframework.data.jpa.repository.JpaRepository;import java.util.List;
public interface ContactRepository extends JpaRepository<TrustedContact,Long>{List<TrustedContact> findByOwnerId(Long id);List<TrustedContact> findByContactId(Long id);}
