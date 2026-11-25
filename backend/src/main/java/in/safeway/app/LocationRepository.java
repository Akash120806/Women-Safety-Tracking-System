package in.safeway.app;import org.springframework.data.jpa.repository.JpaRepository;import java.util.Optional;
public interface LocationRepository extends JpaRepository<LocationPoint,Long>{Optional<LocationPoint> findTopByUserIdOrderByRecordedAtDesc(Long id);}
