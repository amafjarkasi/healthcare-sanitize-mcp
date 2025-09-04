# Threat Model Summary

Assets: secrets (keys, tokens), PII, internal directives, prompt integrity.
Threats: exfiltration via model context, adversarial prompt overreach, regex DoS, token correlation leakage.
Controls: curated regex library, length caps (future), collision precedence, HMAC tokenization (salted), minimal logging.