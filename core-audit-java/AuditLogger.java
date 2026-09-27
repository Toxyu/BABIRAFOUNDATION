import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class AuditLogger {
    private static final String LOG_FILE = System.getenv().getOrDefault("AUDIT_LOG_FILE", "system_audit.log");

    private AuditLogger() {}

    public static void main(String[] args) {
        if (args.length < 3) {
            System.err.println("Usage: java AuditLogger <action> <assetType> <filename>");
            System.exit(2);
        }

        logTransaction(args[0], args[1], args[2]);
    }

    private static void logTransaction(String action, String assetType, String filename) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        String logEntry = String.format("[%s] ACTION: %s | TYPE: %s | FILE: %s",
                timestamp, sanitize(action), sanitize(assetType), sanitize(filename));

        try (FileWriter fileWriter = new FileWriter(LOG_FILE, true);
             PrintWriter printWriter = new PrintWriter(fileWriter)) {
            printWriter.println(logEntry);
            if (printWriter.checkError()) throw new IOException("Could not write audit entry.");
            System.out.println("[Java Audit System] Transaction logged successfully.");
        } catch (IOException error) {
            System.err.println("[Java Audit System Error] Failed to write log: " + error.getMessage());
            System.exit(1);
        }
    }

    private static String sanitize(String value) {
        return value.replaceAll("[\\r\\n\\t]", " ");
    }
}
