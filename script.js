document.addEventListener('DOMContentLoaded', function() {
  const transactionForm = document.getElementById('transaction-form');
  const descriptionInput = document.getElementById('description');
  const amountInput = document.getElementById('amount');
  const typeInput = document.getElementById('type');
  const balanceElement = document.getElementById('balance');
  const transactionsContainer = document.getElementById('transactions');
  
  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
  
  // Initialize the app
  updateBalance();
  renderTransactions();
  
  // Form submission
  transactionForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const description = descriptionInput.value.trim();
      const amount = parseFloat(amountInput.value);
      const type = typeInput.value;
      
      if (description && !isNaN(amount) && amount > 0) {
          const transaction = {
              id: generateId(),
              description,
              amount,
              type
          };
          
          transactions.push(transaction);
          saveTransactions();
          updateBalance();
          renderTransactions();
          
          // Reset form
          transactionForm.reset();
          descriptionInput.focus();
      }
  });
  
  // Generate unique ID
  function generateId() {
      return Math.floor(Math.random() * 1000000000);
  }
  
  // Save transactions to localStorage
  function saveTransactions() {
      localStorage.setItem('transactions', JSON.stringify(transactions));
  }
  
  // Update balance
  function updateBalance() {
      const balance = transactions.reduce((total, transaction) => {
          return transaction.type === 'income' ? 
              total + transaction.amount : 
              total - transaction.amount;
      }, 0);
      
      balanceElement.textContent = `₹${balance.toFixed(2)}`;
      balanceElement.style.color = balance >= 0 ? '#2ecc71' : '#e74c3c';
  }
  
  // Render transactions
  function renderTransactions() {
      if (transactions.length === 0) {
          transactionsContainer.innerHTML = '<p>No transactions yet.</p>';
          return;
      }
      
      transactionsContainer.innerHTML = '';
      
      transactions.forEach(transaction => {
          const transactionElement = document.createElement('div');
          transactionElement.className = `transaction transaction-${transaction.type}`;
          
          const descriptionElement = document.createElement('span');
          descriptionElement.textContent = transaction.description;
          
          const amountElement = document.createElement('span');
          amountElement.className = `transaction-amount-${transaction.type}`;
          amountElement.textContent = `${transaction.type === 'income' ? '+' : '-'}₹${transaction.amount.toFixed(2)}`;
          
          const deleteButton = document.createElement('button');
          deleteButton.className = 'delete-btn';
          deleteButton.textContent = 'x';
          deleteButton.addEventListener('click', () => deleteTransaction(transaction.id));
          
          transactionElement.appendChild(descriptionElement);
          transactionElement.appendChild(amountElement);
          transactionElement.appendChild(deleteButton);
          
          transactionsContainer.appendChild(transactionElement);
      });
  }
  
  // Delete transaction
  function deleteTransaction(id) {
      transactions = transactions.filter(transaction => transaction.id !== id);
      saveTransactions();
      updateBalance();
      renderTransactions();
  }
});