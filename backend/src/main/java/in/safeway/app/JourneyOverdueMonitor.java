package in.safeway.app;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import java.time.LocalDateTime;
@Component
public class JourneyOverdueMonitor {
 private final JourneyRepository journeys; private final ContactRepository contacts; private final NotificationRepository notifications;
 @Value("${app.journey.grace-minutes:15}") private int graceMinutes;
 public JourneyOverdueMonitor(JourneyRepository j,ContactRepository c,NotificationRepository n){journeys=j;contacts=c;notifications=n;}
 @Scheduled(fixedDelayString="${app.journey.monitor-delay-ms:60000}") public void markOverdue(){LocalDateTime cutoff=LocalDateTime.now().minusMinutes(graceMinutes);for(Journey j:journeys.findByStatusAndExpectedArrivalBefore("ACTIVE",cutoff)){j.status="OVERDUE";j.updatedAt=LocalDateTime.now();journeys.save(j);for(TrustedContact c:contacts.findByOwnerId(j.user.id))if("ACCEPTED".equals(c.status))notifications.save(new SafetyNotification(c.contact,j.user,"JOURNEY_OVERDUE","Journey overdue: "+j.destination+". Expected arrival was "+j.expectedArrival));}}
}
