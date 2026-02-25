const handleCreateOrder = async (e) => {
  e.preventDefault();
  const res = await fetch('http://localhost:8000/api/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': 'key_test_abc123',
      'X-Api-Secret': 'secret_test_xyz789'
    },
    body: JSON.stringify({ amount: amount * 100, currency: 'INR' }) // Convert to paise
  });
  const data = await res.json();
  if (data.id) {
    setGeneratedLink(`http://localhost:3001/checkout?order_id=${data.id}`);
  }
};