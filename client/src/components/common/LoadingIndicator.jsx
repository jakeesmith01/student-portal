const LoadingIndicator = () => {
  const handleImageError = () => {
    alert('Failed to load the image!');
  };
    
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <img src="/img/loading.svg" alt="Loading..." onError={handleImageError} />
    </div> 
  );
}
 export default LoadingIndicator;