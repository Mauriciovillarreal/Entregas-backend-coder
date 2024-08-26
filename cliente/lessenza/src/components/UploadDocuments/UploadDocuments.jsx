import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../AuthContext/AuthContext';
import axiosInstance from '../../AxiosInstance/AxiosInstance';
import './UploadDocuments.css';

const UploadDocuments = () => {
  const { user } = useContext(AuthContext);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [fileType, setFileType] = useState('document'); 
  const [productName, setProductName] = useState(''); 

  useEffect(() => {
      }, [user]);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleFileTypeChange = (e) => {
    setFileType(e.target.value);
  };

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFiles) {
      alert('Por favor, selecciona al menos un archivo.');
      return;
    }

    const formData = new FormData();
    const fieldName = fileType === 'profile' ? 'profile' : fileType === 'product' ? 'products' : 'documents';

    Array.from(selectedFiles).forEach((file) => {
      formData.append(fieldName, file);
    });

    if (fileType === 'product') {
      formData.append('productName', productName);
    }

    try {
      const response = await axiosInstance.post(`/api/users/${user._id}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    
      if (response.status >= 200 && response.status < 300) {
        alert('Archivos subidos exitosamente');
        console.log('Respuesta del servidor:', response.data);
      } else {
        alert('Hubo un error al subir los archivos. Por favor, inténtalo nuevamente.');
        console.error('Error en la respuesta del servidor:', response.data);
      }
    } catch (error) {
      alert('Hubo un error al subir los archivos. Por favor, inténtalo nuevamente.');
      console.error('Error al subir los archivos:', error);
    }
  };

  const handleUpgradeToPremium = async () => {
    try {
      const response = await axiosInstance.post(`/api/users/premium/${user._id}`);
      if (response.status >= 200 && response.status < 300) {
        alert('Cuenta actualizada a premium correctamente.');
        console.log('Respuesta del servidor:', response.data);
      } else {
        alert('No se pudo actualizar la cuenta a premium.');
        console.error('Error en la respuesta del servidor:', response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message || 'No se pudo actualizar la cuenta a premium. Verifica la documentación.');
      } else {
        alert('Hubo un error al intentar actualizar la cuenta a premium.');
      }
      console.error('Error al intentar actualizar la cuenta a premium:', error);
    }
  };

  return (
    <div className="upload-documents-container">
      <h2>Subir Documentos para Actualizar a Premium</h2>
      <p>Para actualizar tu cuenta a premium, es necesario subir los siguientes 3 documentos:</p>
      <ul className="required-documents-list">
        <li>Identificación</li>
        <li>Comprobante de domicilio</li>
        <li>Comprobante de estado de cuenta</li>
      </ul>

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="fileType">Tipo de Archivo:</label>
          <select id="fileType" value={fileType} onChange={handleFileTypeChange} className="form-select">
            <option value="profile">Imagen de Perfil</option>
            <option value="product">Imagen de Producto</option>
            <option value="document">Documento</option>
          </select>
        </div>

        {fileType === 'product' && (
          <div className="form-group">
            <label htmlFor="productName">Nombre del Producto:</label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={handleProductNameChange}
              className="form-input"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="files">Selecciona Archivos:</label>
          <input
            type="file"
            id="files"
            multiple
            name="file"
            onChange={handleFileChange}
            className="form-input"
            required
          />
        </div>

        <button type="submit" className="submit-button">Subir Archivos</button>
      </form>

      <button onClick={handleUpgradeToPremium} className="upgrade-button">
        Actualizar a Premium
      </button>
    </div>
  );
};

export default UploadDocuments;
