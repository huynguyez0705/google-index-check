let apiKey ='aa5928ba9d19484bb6d7543637c01362c805ae0e';

// Load countries based on search query
async function loadCountries(query = '') {
  try {
    const response = await fetch(`https://api.serper.dev/locations?q=${query}&limit=25`, {
      method: 'GET',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    const select = document.getElementById('country');
    select.innerHTML = '<option value="">Select Country</option>'; // Reset dropdown
    data.forEach(loc => {
      if (loc.targetType === 'Country') { // Chỉ lấy các quốc gia
        const option = document.createElement('option');
        option.value = loc.countryCode.toLowerCase();
        option.textContent = loc.name;
        select.appendChild(option);
      }
    });
  } catch (error) {
    console.error('Error loading countries:', error);
  }
}

// Gọi khi trang load
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('apiKey').value = apiKey;
  loadCountries(); // Load mặc định không có query

  // Cập nhật khi nhập API key
  document.getElementById('apiKey').addEventListener('input', (e) => {
    apiKey = e.target.value;
    localStorage.setItem('apiKey', apiKey);
    loadCountries(); // Reload countries khi thay đổi API key
  });

  // Thêm sự kiện tìm kiếm khi thay đổi query (nếu cần)
  document.getElementById('country').addEventListener('input', (e) => {
    const query = e.target.value;
    loadCountries(query); // Tìm kiếm theo giá trị nhập
  });
});