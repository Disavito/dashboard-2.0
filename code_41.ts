      if (values.transactionType === 'Devolucion' || values.transactionType === 'Gasto') {
        finalAmount = -Math.abs(values.amount); // Ensure it's negative
      } else if (values.transactionType === 'Anulacion') {
        finalAmount = 0;
      }
