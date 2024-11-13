import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({
        nombre: "",
        biografia: "",
        fecha_nacimiento: ""
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/artistas/");
            setData(response.data);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://127.0.0.1:8000/api/artistas/${editingId}/`, formData);
                setEditingId(null);
            } else {
                await axios.post("http://127.0.0.1:8000/api/artistas/", formData);
            }
            setFormData({ nombre: "", biografia: "", fecha_nacimiento: "" });
            fetchData();
        } catch (error) {
            console.error("Error al guardar los datos:", error);
        }
    };

    const handleEdit = (id) => {
        const artist = data.find((item) => item.id === id);
        setFormData({
            nombre: artist.nombre,
            biografia: artist.biografia,
            fecha_nacimiento: artist.fecha_nacimiento
        });
        setEditingId(id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/artistas/${id}/`);
            fetchData();
        } catch (error) {
            console.error("Error al eliminar el dato:", error);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="w-50">
                <h2 className="text-center">Artistas</h2>
                <table className="table table-striped table-bordered mt-3">
                    <thead className="thead-dark">
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Biografía</th>
                            <th>Fecha de Nacimiento</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.nombre}</td>
                                <td>{item.biografia}</td>
                                <td>{item.fecha_nacimiento}</td>
                                <td>
                                    <button className="btn btn-success btn-sm me-2" onClick={() => handleEdit(item.id)}>
                                        Editar
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h3 className="text-center mt-5">{editingId ? "Editar Artista" : "Nuevo Artista"}</h3>
                <form onSubmit={handleSubmit} className="mt-3">
                    <div className="mb-3">
                        <label className="form-label">Nombre:</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Biografía:</label>
                        <textarea
                            name="biografia"
                            value={formData.biografia}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Fecha de Nacimiento:</label>
                        <input
                            type="date"
                            name="fecha_nacimiento"
                            value={formData.fecha_nacimiento}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        {editingId ? "Actualizar" : "Guardar"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default App;
