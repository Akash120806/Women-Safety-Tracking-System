package in.safeway.app;import org.springframework.data.jpa.repository.JpaRepository;import java.util.List;
public interface SosRepository extends JpaRepository<SosAlert,Long>{List<SosAlert> findByUserIdOrderByCreatedAtDesc(Long id);}
