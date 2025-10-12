// Honeypot Security Functions
function logHoneypotAlert(type, details) {
  if (window.firebaseDB) {
    window.firebaseDB.collection("honeypot_alerts").add({
      type,
      details,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}

function showError(message) {
  const errorDivId = 'honeypot-error';
  let errorDiv = document.getElementById(errorDivId);
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.id = errorDivId;
    errorDiv.style.color = 'red';
    errorDiv.style.marginTop = '10px';
    sendForm.appendChild(errorDiv);
  }
  errorDiv.textContent = message;
}

function checkAllHoneypots(form) {
  const honeypots = {
    hpsql: "Suspicious SQL pattern detected!",
    hpxss: "Suspicious script detected!",
    hpadmin: "Admin field filled!",
    hpcsrf: "CSRF pattern detected!",
    hpbrute: "Brute-force bot activity detected!",
    hpssrf: "SSRF attempt detected!",
    hpdir: "Directory traversal detected!",
    hpgen: "Generic bot attack detected!"
  };

  for (const key in honeypots) {
    if (form[key] && form[key].value.trim() !== "") {
      showError(honeypots[key]);
      console.log('Honeypot triggered:', key);
      return false;
    }
  }
  // Clear error if no honeypot detected
  const errorDiv = document.getElementById('honeypot-error');
  if (errorDiv) errorDiv.textContent = '';
  return true;
}

function checkAllHoneypots(form) {
  if (form.hpsql && form.hpsql.value.trim()) {
    console.log("Honeypot triggered: SQL Injection");
    alert("Suspicious SQL pattern detected!");
    return false;
  }
  if (form.hpxss && form.hpxss.value.trim()) {
    console.log("Honeypot triggered: XSS");
    alert("Suspicious script detected!");
    return false;
  }
  if (form.hpadmin && form.hpadmin.value.trim()) {
    console.log("Honeypot triggered: Admin Field");
    alert("Admin field filled!");
    return false;
  }
  if (form.hpcsrf && form.hpcsrf.value.trim()) {
    console.log("Honeypot triggered: CSRF");
    alert("CSRF pattern detected!");
    return false;
  }
  if (form.hpbrute && form.hpbrute.value.trim()) {
    console.log("Honeypot triggered: Brute Force");
    alert("Brute-force/bot activity detected!");
    return false;
  }
  if (form.hpssrf && form.hpssrf.value.trim()) {
    console.log("Honeypot triggered: SSRF");
    alert("SSRF attempt detected!");
    return false;
  }
  if (form.hpdir && form.hpdir.value.trim()) {
    console.log("Honeypot triggered: Dir Traversal");
    alert("Directory traversal detected!");
    return false;
  }
  if (form.hpgen && form.hpgen.value.trim()) {
    console.log("Honeypot triggered: Generic");
    alert("Generic bot attack detected!");
    return false;
  }
  console.log("No honeypots triggered");
  return true;
}

document.addEventListener('DOMContentLoaded', function() {
  const sendForm = document.getElementById('sendForm');
  if (!sendForm) return;

  sendForm.addEventListener('submit', function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (!checkAllHoneypots(sendForm)) {
      console.log('Honeypot detected - submission blocked.');
      return false;
    }

    // If honeypots clear, proceed to process payment
    if (typeof sendForm.processSendPayment === 'function') {
      sendForm.processSendPayment();
    } else {
      console.log('processSendPayment() not found.');
    }
  });
});

function checkAllHoneypots(form) {
  const honeypots = {
    hpsql: "Suspicious SQL pattern detected!",
    hpxss: "Suspicious script detected!",
    hpadmin: "Admin field filled!",
    hpcsrf: "CSRF pattern detected!",
    hpbrute: "Brute-force bot activity detected!",
    hpssrf: "SSRF attempt detected!",
    hpdir: "Directory traversal detected!",
    hpgen: "Generic bot attack detected!"
  };

  for (const key in honeypots) {
    if (form[key] && form[key].value.trim() !== '') {
      alert(honeypots[key]);
      return false;
    }
  }
  return true;
}



document.getElementById('sendForm').onsubmit = function(event) {
if (sendForm) {
  
    event.preventDefault();
    event.stopImmediatePropagation();

    if (!checkAllHoneypots(this)) {
      return false;
    }

    this.processSendPayment(); // Your existing payment function
  };
}



// SecureWallet Class
class SecureWallet {
    constructor() {
        this.resendTimer = null;
        this.resendCountdown = 60; // 60 seconds cooldown
        this.connectedWallet = null;
        this.currentScreen = 'email-screen';
        this.generatedOTP = null;
        this.otpExpiry = null;
        this.resendCooldown = false;
        
        // User data structure
        this.userData = {
            email: '',
            passwordHash: '',
            seedPhrase: '',
            walletAddress: '',
            balances: {
                BTC: { amount: 0.15647832, usdvalue: 4234.56 },
                ETH: { amount: 3.24567891, usdvalue: 5678.90 },
                USDT: { amount: 1234.56, usdvalue: 1234.56 }
            },
            transactions: []
        };

        // Sample wallet addresses for different currencies
        this.walletAddresses = {
            BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
            ETH: '0x742d35Cc6634C0532925a3b8D7A7C0CfF7E0A5b8',
            USDT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
        };

        this.currentTab = 'overview';
        this.paymentRequestId = 0;
        
        this.init();
    }

    init() {
        console.log("SecureWallet initializing...");
        this.setupEventListeners();
        this.generateSeedPhrase();
        this.loadSampleTransactions();
        console.log("SecureWallet ready!");
    }

    // MetaMask connection methods
    async connectMetaMask() {
        try {
            if (typeof window.ethereum !== 'undefined') {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                this.connectedWallet = accounts[0];
                this.updateWalletDisplay();
                this.showNotification('MetaMask connected successfully!', 'success');
                return accounts[0];
            } else {
                this.showNotification('MetaMask not found. Please install MetaMask.', 'error');
                return null;
            }
        } catch (error) {
            console.error('MetaMask connection failed:', error);
            this.showNotification('Failed to connect MetaMask: ' + error.message, 'error');
            return null;
        }
    }

    async disconnectMetaMask() {
        this.connectedWallet = null;
        this.updateWalletDisplay();
        this.showNotification('MetaMask disconnected', 'info');
    }

    updateWalletDisplay() {
        const walletAddressElement = document.getElementById('walletAddress');
        const connectBtn = document.getElementById('connectWalletBtn');
        const disconnectBtn = document.getElementById('disconnectWalletBtn');

        if (this.connectedWallet) {
            walletAddressElement.textContent = `Connected: ${this.connectedWallet.substring(0, 6)}...${this.connectedWallet.substring(38)}`;
            connectBtn.style.display = 'none';
            disconnectBtn.style.display = 'inline-block';
        } else {
            walletAddressElement.textContent = 'Not Connected';
            connectBtn.style.display = 'inline-block';
            disconnectBtn.style.display = 'none';
        }
    }

    setupEventListeners() {
        // Email verification listeners
        document.getElementById('send-otp-btn').addEventListener('click', () => this.sendOTP());
        document.getElementById('resend-otp-btn').addEventListener('click', () => this.resendOTP());
        document.getElementById('verify-otp-btn').addEventListener('click', () => this.verifyOTP());

        // Password screen listeners
        document.getElementById('password').addEventListener('input', () => this.checkPasswordStrength());
        document.getElementById('confirm-password').addEventListener('input', () => this.validatePasswordMatch());
        document.getElementById('continue-password-btn').addEventListener('click', () => this.continueToSeedPhrase());

        // Password visibility toggles
        document.getElementById('password-toggle').addEventListener('click', () => this.togglePasswordVisibility('password'));
        document.getElementById('confirm-password-toggle').addEventListener('click', () => this.togglePasswordVisibility('confirm-password'));

        // Seed phrase listeners
        document.getElementById('regenerate-seed-btn').addEventListener('click', () => this.generateSeedPhrase());
        document.getElementById('download-seed-btn').addEventListener('click', () => this.downloadSeedPhrase());
        document.getElementById('seed-confirmation').addEventListener('input', () => this.validateSeedConfirmation());
        document.getElementById('seed-saved-checkbox').addEventListener('change', () => this.checkAccessWalletButton());
        document.getElementById('access-wallet-btn').addEventListener('click', () => this.accessWallet());

        // Dashboard listeners
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        document.getElementById('copy-address-btn').addEventListener('click', () => this.copyWalletAddress());

        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Quick action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.action));
        });

        // Form submissions with honeypot protection
        this.setupFormListeners();

        // OTP input navigation
        this.setupOTPInputs();

        // MetaMask connection
        document.getElementById('connectWalletBtn').addEventListener('click', () => this.connectMetaMask());
        document.getElementById('disconnectWalletBtn').addEventListener('click', () => this.disconnectMetaMask());
        document.getElementById('delete-account-btn').addEventListener('click', () => this.deleteMetaMaskAccount());
        document.getElementById('sendTxBtn').addEventListener('click', () => this.sendTransaction());

        // QR code generation
        document.getElementById('generate-payment-qr-btn').addEventListener('click', () => this.generatePaymentQR());
        document.getElementById('download-qr-btn').addEventListener('click', () => this.downloadQR());
    }

    setupFormListeners() {
        // Protect send form
        const sendForm = document.getElementById('sendForm');
        if (sendForm) {
            sendForm.addEventListener('submit', (event) => {
                if (!checkAllHoneypots(sendForm)) {
                    event.preventDefault();
                    return false;
                }
                event.preventDefault();
                this.processSendPayment();
            });
        }

        // Protect receive form
        const receiveForm = document.getElementById('receiveForm');
        if (receiveForm) {
            receiveForm.addEventListener('submit', (event) => {
                if (!checkAllHoneypots(receiveForm)) {
                    event.preventDefault();
                    return false;
                }
                event.preventDefault();
                this.processReceiveRequest();
            });
        }

        // Protect transfer form
        const transferForm = document.getElementById('transferForm');
        if (transferForm) {
            transferForm.addEventListener('submit', (event) => {
                if (!checkAllHoneypots(transferForm)) {
                    event.preventDefault();
                    return false;
                }
                event.preventDefault();
                this.processTransfer();
            });
        }
    }

    setupOTPInputs() {
        const otpInputs = document.querySelectorAll('.otp-input');
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    otpInputs[index - 1].focus();
                }
            });
        });
    }

    async sendOTP() {
        const email = document.getElementById('email').value;
        const emailError = document.getElementById('email-error');
        
        if (!this.validateEmail(email)) {
            this.showError('email-error', 'Please enter a valid email address');
            return;
        }

        this.clearError('email-error');
        
        // Generate 6-digit OTP
        this.generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        this.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        
        try {
            // Initialize EmailJS if not already done
            emailjs.init("service_y78nm2e");
            
            // Send email using EmailJS
            const templateParams = {
                to_email: email,
                user_email: email,
                otp_code: this.generatedOTP,
                expiry_time: '10 minutes'
            };

            await emailjs.send('service_y78nm2e', 'template_f8o3n6j', templateParams);
            
            this.userData.email = email;
            this.showOTPSection();
            this.startResendCooldown();
            this.showNotification(`OTP sent to ${email}`, 'success');
            
        } catch (error) {
            console.error('Failed to send OTP:', error);
            this.showError('email-error', 'Failed to send OTP. Please try again.');
        }
    }

    async resendOTP() {
        if (this.resendCooldown) return;
        await this.sendOTP();
    }

    startResendCooldown() {
        this.resendCooldown = true;
        let countdown = this.resendCountdown;
        const resendBtn = document.getElementById('resend-otp-btn');
        const countdownSpan = document.getElementById('countdown');
        const resendSection = document.getElementById('resend-section');
        
        resendSection.style.display = 'block';
        resendBtn.disabled = true;
        
        this.resendTimer = setInterval(() => {
            countdownSpan.textContent = countdown;
            countdown--;
            
            if (countdown < 0) {
                clearInterval(this.resendTimer);
                resendBtn.disabled = false;
                resendBtn.innerHTML = 'Resend OTP';
                this.resendCooldown = false;
            }
        }, 1000);
    }

    showOTPSection() {
        document.getElementById('otp-section').classList.remove('hidden');
        document.querySelector('.otp-input').focus();
    }

    verifyOTP() {
        const otpInputs = document.querySelectorAll('.otp-input');
        const enteredOTP = Array.from(otpInputs).map(input => input.value).join('');
        
        if (enteredOTP.length !== 6) {
            this.showError('otp-error', 'Please enter all 6 digits');
            return;
        }
        
        if (Date.now() > this.otpExpiry) {
            this.showError('otp-error', 'OTP has expired. Please request a new one.');
            return;
        }
        
        if (enteredOTP === this.generatedOTP) {
            this.clearError('otp-error');
            this.switchScreen('password-screen');
            this.showNotification('Email verified successfully!', 'success');
        } else {
            this.showError('otp-error', 'Invalid OTP. Please try again.');
            // Clear all OTP inputs
            otpInputs.forEach(input => input.value = '');
            otpInputs[0].focus();
        }
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    checkPasswordStrength() {
        const password = document.getElementById('password').value;
        const strengthFill = document.getElementById('strength-fill');
        const strengthText = document.getElementById('strength-text');
        
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        // Update requirement indicators
        Object.keys(requirements).forEach(req => {
            const element = document.getElementById(`req-${req}`);
            const icon = element.querySelector('.req-icon');
            if (requirements[req]) {
                element.classList.add('met');
                icon.textContent = '✅';
            } else {
                element.classList.remove('met');
                icon.textContent = '❌';
            }
        });

        // Calculate strength
        const metRequirements = Object.values(requirements).filter(Boolean).length;
        const strength = (metRequirements / 5) * 100;
        
        strengthFill.style.width = strength + '%';
        
        if (strength < 40) {
            strengthFill.style.background = '#ff4444';
            strengthText.textContent = 'Weak';
        } else if (strength < 80) {
            strengthFill.style.background = '#ffaa00';
            strengthText.textContent = 'Medium';
        } else {
            strengthFill.style.background = '#00aa44';
            strengthText.textContent = 'Strong';
        }

        this.validatePasswordMatch();
    }

    validatePasswordMatch() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const continueBtn = document.getElementById('continue-password-btn');
        
        const allRequirementsMet = document.querySelectorAll('.requirement.met').length === 5;
        const passwordsMatch = password === confirmPassword && password.length > 0;
        
        if (allRequirementsMet && passwordsMatch) {
            continueBtn.disabled = false;
            this.clearError('password-error');
        } else {
            continueBtn.disabled = true;
            if (confirmPassword.length > 0 && !passwordsMatch) {
                this.showError('password-error', 'Passwords do not match');
            } else {
                this.clearError('password-error');
            }
        }
    }

    togglePasswordVisibility(inputId) {
        const input = document.getElementById(inputId);
        const toggle = document.getElementById(inputId + '-toggle');
        const icon = toggle.querySelector('.eye-icon');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.textContent = '🙈';
        } else {
            input.type = 'password';
            icon.textContent = '👁️';
        }
    }

    continueToSeedPhrase() {
        const password = document.getElementById('password').value;
        this.userData.passwordHash = this.hashPassword(password);
        this.switchScreen('seedphrase-screen');
    }

    hashPassword(password) {
        // Simple hash for demo - use proper hashing in production
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    generateSeedPhrase() {
        const words = [
            'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
            'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
            'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
            'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance',
            'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'against', 'age',
            'agent', 'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm',
            'album', 'alcohol', 'alert', 'alien', 'all', 'alley', 'allow', 'almost',
            'alone', 'alpha', 'already', 'also', 'alter', 'always', 'amateur', 'amazing',
            'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle'
        ];

        const seedPhrase = [];
        for (let i = 0; i < 12; i++) {
            const randomIndex = Math.floor(Math.random() * words.length);
            seedPhrase.push(words[randomIndex]);
        }

        this.userData.seedPhrase = seedPhrase.join(' ');
        this.displaySeedPhrase(seedPhrase);
    }

    displaySeedPhrase(seedPhrase) {
        const container = document.getElementById('seed-words-display');
        container.innerHTML = '';

        seedPhrase.forEach((word, index) => {
            const wordElement = document.createElement('div');
            wordElement.className = 'seed-word';
            wordElement.innerHTML = `
                <span class="word-number">${index + 1}</span>
                <span class="word-text">${word}</span>
            `;
            container.appendChild(wordElement);
        });
    }

    downloadSeedPhrase() {
        const content = `SecureWallet Recovery Seed Phrase
        
IMPORTANT: Keep this seed phrase safe and private!

Your 12-word recovery phrase:
${this.userData.seedPhrase}

Date Generated: ${new Date().toLocaleString()}

SECURITY WARNINGS:
- Never share this phrase with anyone
- Store it offline in a secure location
- Anyone with this phrase can access your wallet
- Write it down on paper and store safely
`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `securewallet-recovery-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    validateSeedConfirmation() {
        const confirmation = document.getElementById('seed-confirmation').value.toLowerCase().trim();
        const original = this.userData.seedPhrase.toLowerCase();
        
        if (confirmation === original) {
            this.clearError('seed-error');
            this.checkAccessWalletButton();
        } else if (confirmation.length > 0) {
            this.showError('seed-error', 'Seed phrase does not match. Please check your entry.');
        }
    }

    checkAccessWalletButton() {
        const confirmation = document.getElementById('seed-confirmation').value.toLowerCase().trim();
        const original = this.userData.seedPhrase.toLowerCase();
        const checkbox = document.getElementById('seed-saved-checkbox').checked;
        const accessBtn = document.getElementById('access-wallet-btn');
        
        if (confirmation === original && checkbox) {
            accessBtn.disabled = false;
        } else {
            accessBtn.disabled = true;
        }
    }

    accessWallet() {
        // Generate wallet address
        this.userData.walletAddress = this.generateWalletAddress();
        this.switchScreen('dashboard-screen');
        this.updateDashboard();
        this.showNotification('Welcome to your SecureWallet!', 'success');
    }

    generateWalletAddress() {
        // Generate a sample Ethereum-like address
        const chars = '0123456789abcdef';
        let address = '0x';
        for (let i = 0; i < 40; i++) {
            address += chars[Math.floor(Math.random() * chars.length)];
        }
        return address;
    }

    updateDashboard() {
        // Update user email display
        document.getElementById('user-email-display').textContent = this.userData.email;
        
        // Update wallet address display
        const addressDisplay = document.getElementById('wallet-address-display');
        if (addressDisplay) {
            const shortAddress = `${this.userData.walletAddress.substring(0, 6)}...${this.userData.walletAddress.substring(-4)}`;
            addressDisplay.textContent = shortAddress;
        }
        
        // Update balances
        this.updateBalanceDisplay();
        
        // Load recent transactions
        this.loadRecentTransactions();
    }

    updateBalanceDisplay() {
        const { BTC, ETH, USDT } = this.userData.balances;
        
        // Update individual crypto amounts
        document.getElementById('btc-amount').textContent = `${BTC.amount.toFixed(8)} BTC`;
        document.getElementById('btc-value').textContent = `$${BTC.usdvalue.toFixed(2)}`;
        
        document.getElementById('eth-amount').textContent = `${ETH.amount.toFixed(8)} ETH`;
        document.getElementById('eth-value').textContent = `$${ETH.usdvalue.toFixed(2)}`;
        
        document.getElementById('usdt-amount').textContent = `${USDT.amount.toFixed(2)} USDT`;
        document.getElementById('usdt-value').textContent = `$${USDT.usdvalue.toFixed(2)}`;
        
        // Update total balance
        const totalValue = BTC.usdvalue + ETH.usdvalue + USDT.usdvalue;
        document.getElementById('total-balance').textContent = `$${totalValue.toFixed(2)}`;
    }

    loadSampleTransactions() {
        const sampleTransactions = [
            {
                id: 'tx_001',
                type: 'received',
                currency: 'BTC',
                amount: 0.05647832,
                usdValue: 1500.00,
                from: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
                to: this.walletAddresses.BTC,
                timestamp: Date.now() - 86400000, // 1 day ago
                status: 'confirmed',
                fee: 0.0001
            },
            {
                id: 'tx_002',
                type: 'sent',
                currency: 'ETH',
                amount: 1.24567891,
                usdValue: 2000.00,
                from: this.walletAddresses.ETH,
                to: '0x8ba1f109551bD432803012645Hac136c',
                timestamp: Date.now() - 172800000, // 2 days ago
                status: 'confirmed',
                fee: 0.005
            },
            {
                id: 'tx_003',
                type: 'received',
                currency: 'USDT',
                amount: 500.00,
                usdValue: 500.00,
                from: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
                to: this.walletAddresses.USDT,
                timestamp: Date.now() - 259200000, // 3 days ago
                status: 'confirmed',
                fee: 1.00
            }
        ];
        
        this.userData.transactions = sampleTransactions;
    }

    loadRecentTransactions() {
        const container = document.getElementById('recent-transactions-list');
        const recentTx = this.userData.transactions.slice(0, 5);
        
        if (recentTx.length === 0) {
            container.innerHTML = '<div class="no-transactions">No recent transactions</div>';
            return;
        }
        
        container.innerHTML = recentTx.map(tx => this.createTransactionElement(tx)).join('');
    }

    createTransactionElement(tx) {
        const typeIcon = tx.type === 'sent' ? '📤' : '📥';
        const typeClass = tx.type === 'sent' ? 'sent' : 'received';
        const amountPrefix = tx.type === 'sent' ? '-' : '+';
        const timeAgo = this.getTimeAgo(tx.timestamp);
        
        return `
            <div class="transaction-item ${typeClass}">
                <div class="tx-icon">${typeIcon}</div>
                <div class="tx-details">
                    <div class="tx-primary">
                        <span class="tx-type">${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} ${tx.currency}</span>
                        <span class="tx-amount">${amountPrefix}${tx.amount} ${tx.currency}</span>
                    </div>
                    <div class="tx-secondary">
                        <span class="tx-time">${timeAgo}</span>
                        <span class="tx-value">$${tx.usdValue.toFixed(2)}</span>
                    </div>
                </div>
                <div class="tx-status ${tx.status}">${tx.status}</div>
            </div>
        `;
    }

    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    }

    switchTab(tabName) {
        // Remove active class from all tabs and panes
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        
        // Add active class to selected tab and pane
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        this.currentTab = tabName;
        
        // Load tab-specific data
        if (tabName === 'history') {
            this.loadTransactionHistory();
        }
    }

    loadTransactionHistory() {
        const container = document.getElementById('transaction-history-list');
        const allTransactions = this.userData.transactions;
        
        if (allTransactions.length === 0) {
            container.innerHTML = '<div class="no-transactions">No transactions found</div>';
            return;
        }
        
        container.innerHTML = allTransactions.map(tx => this.createDetailedTransactionElement(tx)).join('');
    }

    createDetailedTransactionElement(tx) {
        const typeIcon = tx.type === 'sent' ? '📤' : '📥';
        const typeClass = tx.type === 'sent' ? 'sent' : 'received';
        const amountPrefix = tx.type === 'sent' ? '-' : '+';
        const address = tx.type === 'sent' ? tx.to : tx.from;
        const shortAddress = `${address.substring(0, 8)}...${address.substring(-6)}`;
        
        return `
            <div class="transaction-item detailed ${typeClass}">
                <div class="tx-header">
                    <div class="tx-icon">${typeIcon}</div>
                    <div class="tx-main-info">
                        <div class="tx-type-amount">
                            <span class="tx-type">${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</span>
                            <span class="tx-amount">${amountPrefix}${tx.amount} ${tx.currency}</span>
                        </div>
                        <div class="tx-address">
                            <span class="address-label">${tx.type === 'sent' ? 'To:' : 'From:'}</span>
                            <span class="address-value">${shortAddress}</span>
                        </div>
                    </div>
                    <div class="tx-values">
                        <div class="tx-usd-value">$${tx.usdValue.toFixed(2)}</div>
                        <div class="tx-status ${tx.status}">${tx.status}</div>
                    </div>
                </div>
                <div class="tx-footer">
                    <span class="tx-id">ID: ${tx.id}</span>
                    <span class="tx-timestamp">${new Date(tx.timestamp).toLocaleString()}</span>
                    <span class="tx-fee">Fee: ${tx.fee} ${tx.currency}</span>
                </div>
            </div>
        `;
    }

    processSendPayment() {
        const currency = document.getElementById('send-currency').value;
        const address = document.getElementById('send-address').value;
        const amount = parseFloat(document.getElementById('send-amount').value);
        
        if (!address || !amount || amount <= 0) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Validate address format (basic validation)
        if (!this.validateAddress(address, currency)) {
            this.showNotification('Invalid wallet address format', 'error');
            return;
        }
        
        // Check balance
        if (amount > this.userData.balances[currency].amount) {
            this.showNotification('Insufficient balance', 'error');
            return;
        }
        
        // Process the transaction
        const newTransaction = {
            id: `tx_${Date.now()}`,
            type: 'sent',
            currency: currency,
            amount: amount,
            usdValue: amount * (this.userData.balances[currency].usdvalue / this.userData.balances[currency].amount),
            from: this.walletAddresses[currency],
            to: address,
            timestamp: Date.now(),
            status: 'pending',
            fee: this.calculateFee(currency, amount)
        };
        
        // Update balance
        this.userData.balances[currency].amount -= amount;
        this.userData.balances[currency].usdvalue -= newTransaction.usdValue;
        
        // Add transaction
        this.userData.transactions.unshift(newTransaction);
        
        // Update displays
        this.updateBalanceDisplay();
        this.loadRecentTransactions();
        
        // Clear form
        document.getElementById('send-address').value = '';
        document.getElementById('send-amount').value = '';
        
        // Simulate confirmation after 3 seconds
        setTimeout(() => {
            newTransaction.status = 'confirmed';
            this.loadRecentTransactions();
            this.showNotification(`${amount} ${currency} sent successfully!`, 'success');
        }, 3000);
        
        this.showNotification(`Transaction initiated: ${amount} ${currency}`, 'info');
    }

    validateAddress(address, currency) {
        const patterns = {
            BTC: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/,
            ETH: /^0x[a-fA-F0-9]{40}$/,
            USDT: /^T[A-Za-z1-9]{33}$/
        };
        
        return patterns[currency] && patterns[currency].test(address);
    }

    calculateFee(currency, amount) {
        const feeRates = {
            BTC: 0.0001,
            ETH: 0.005,
            USDT: 1.0
        };
        
        return feeRates[currency] || 0.001;
    }

    processReceiveRequest() {
        this.generatePaymentQR();
    }

    processTransfer() {
        const fromAccount = document.getElementById('transfer-from').value;
        const toAccount = document.getElementById('transfer-to').value;
        const currency = document.getElementById('transfer-currency').value;
        const amount = parseFloat(document.getElementById('transfer-amount').value);
        const note = document.getElementById('transfer-note').value;
        
        if (fromAccount === toAccount) {
            this.showNotification('Cannot transfer to the same account', 'error');
            return;
        }
        
        if (!amount || amount <= 0) {
            this.showNotification('Please enter a valid amount', 'error');
            return;
        }
        
        // Process internal transfer
        const transferTransaction = {
            id: `transfer_${Date.now()}`,
            type: 'transfer',
            currency: currency,
            amount: amount,
            from: fromAccount,
            to: toAccount,
            note: note,
            timestamp: Date.now(),
            status: 'confirmed'
        };
        
        this.userData.transactions.unshift(transferTransaction);
        this.loadRecentTransactions();
        
        // Clear form
        document.getElementById('transfer-amount').value = '';
        document.getElementById('transfer-note').value = '';
        
        this.showNotification(`Internal transfer of ${amount} ${currency} completed`, 'success');
    }

    generatePaymentQR() {
        const currency = document.getElementById('request-currency').value;
        const amount = document.getElementById('request-amount').value;
        const canvas = document.getElementById('receive-qr-canvas');
        
        const walletAddress = this.walletAddresses[currency];
        let qrData = walletAddress;
        
        if (amount && parseFloat(amount) > 0) {
            qrData += `?amount=${amount}`;
        }
        
        QRCode.toCanvas(canvas, qrData, {
            width: 200,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        }, (error) => {
            if (error) {
                console.error('QR code generation failed:', error);
                this.showError('qr-error', 'Failed to generate QR code');
            } else {
                this.clearError('qr-error');
                this.showNotification('Payment QR code generated', 'success');
            }
        });
    }

    downloadQR() {
        const canvas = document.getElementById('receive-qr-canvas');
        const link = document.createElement('a');
        link.download = `payment-qr-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    }

    copyWalletAddress() {
        const address = this.userData.walletAddress;
        navigator.clipboard.writeText(address).then(() => {
            this.showNotification('Wallet address copied to clipboard', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy address', 'error');
        });
    }

    async sendTransaction() {
        const recipient = document.getElementById('recipient').value;
        const amount = document.getElementById('amount').value;
        
        if (!this.connectedWallet) {
            this.showNotification('Please connect MetaMask first', 'error');
            return;
        }
        
        if (!recipient || !amount) {
            this.showNotification('Please enter recipient and amount', 'error');
            return;
        }
        
        try {
            const transactionParameters = {
                to: recipient,
                from: this.connectedWallet,
                value: window.ethereum.utils?.toHex(window.ethereum.utils?.toWei(amount, 'ether')) || '0x0'
            };
            
            const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
            
            this.showNotification(`Transaction sent! Hash: ${txHash}`, 'success');
        } catch (error) {
            console.error('Transaction failed:', error);
            this.showNotification('Transaction failed: ' + error.message, 'error');
        }
    }

    deleteMetaMaskAccount() {
        if (confirm('Are you sure you want to disconnect from MetaMask?')) {
            this.disconnectMetaMask();
        }
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            // Clear user data
            this.userData = {
                email: '',
                passwordHash: '',
                seedPhrase: '',
                walletAddress: '',
                balances: {
                    BTC: { amount: 0, usdvalue: 0 },
                    ETH: { amount: 0, usdvalue: 0 },
                    USDT: { amount: 0, usdvalue: 0 }
                },
                transactions: []
            };
            
            this.disconnectMetaMask();
            this.switchScreen('email-screen');
            this.showNotification('Logged out successfully', 'info');
        }
    }

    switchScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenName).classList.add('active');
        this.currentScreen = screenName;
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }

    clearError(elementId) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = '';
        errorElement.classList.add('hidden');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '6px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: '10000',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });
        
        // Set background color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8',
            warning: '#ffc107'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.style.opacity = '1', 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Initialize SecureWallet when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.secureWallet = new SecureWallet();
});

document.getElementById('send-payment-form').addEventListener('submit', function(event) {
    if (!checkAllHoneypots(this)) {
        event.preventDefault();  // stops submit/redirect
    }
});
