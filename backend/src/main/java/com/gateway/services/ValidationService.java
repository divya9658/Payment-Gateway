package com.gateway.services;

import org.springframework.stereotype.Service;
import java.util.Random;
import java.time.YearMonth;

@Service
public class ValidationService {

    public String generateId(String prefix) {
        // Requirements: Prefix + exactly 16 alphanumeric characters
        String alphanumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder(prefix);
        Random random = new Random();
        for (int i = 0; i < 16; i++) { 
            sb.append(alphanumeric.charAt(random.nextInt(alphanumeric.length())));
        }
        return sb.toString();
    }

    public boolean validateVPA(String vpa) {
        // Matches pattern: ^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$
        return vpa != null && vpa.matches("^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$");
    }

    public boolean validateLuhn(String cardNumber) {
        if (cardNumber == null) return false;
        String n = cardNumber.replaceAll("\\D", ""); // Remove spaces/dashes
        if (n.length() < 13 || n.length() > 19) return false;

        int sum = 0;
        boolean alternate = false;
        for (int i = n.length() - 1; i >= 0; i--) {
            int d = Integer.parseInt(n.substring(i, i + 1));
            if (alternate) {
                d *= 2;
                if (d > 9) d -= 9;
            }
            sum += d;
            alternate = !alternate;
        }
        return (sum % 10 == 0); //
    }

    public String detectNetwork(String cardNumber) {
        String n = cardNumber.replaceAll("\\D", "");
        if (n.startsWith("4")) return "visa"; //
        if (n.matches("^(51|52|53|54|55).*")) return "mastercard"; //
        if (n.matches("^(34|37).*")) return "amex"; //
        // RuPay: 60, 65, or 81-89
        if (n.matches("^(60|65|81|82|83|84|85|86|87|88|89).*")) return "rupay"; 
        return "unknown";
    }

    public boolean validateExpiry(String month, String year) {
        try {
            int m = Integer.parseInt(month);
            if (m < 1 || m > 12) return false;
            
            int y = (year.length() == 2) ? 2000 + Integer.parseInt(year) : Integer.parseInt(year);
            YearMonth expiryDate = YearMonth.of(y, m);
            // Expiry must be current month or future
            return !expiryDate.isBefore(YearMonth.now()); 
        } catch (Exception e) {
            return false;
        }
    }
}