import "../styles/RouteForm.css";
import TagSelector from "./TagSelector";
import PropTypes from "prop-types";

const RouteForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="route-form">
      <h2>Criar rota</h2>

      <div className="form-group">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Título"
          className="form-control"
        />
      </div>

      <div className="form-row">
        <div className="form-group half">
          <input
            type="text"
            name="starting_location"
            value={formData.starting_location}
            onChange={handleChange}
            placeholder="Origem"
            className="form-control"
          />
        </div>
        <div className="form-group half">
          <input
            type="text"
            name="ending_location"
            value={formData.ending_location}
            onChange={handleChange}
            placeholder="Destino"
            className="form-control"
          />
        </div>
      </div>

      <div className="form-group">
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descrição"
          className="form-control"
          rows="4"
        ></textarea>
      </div>

      <div className="form-group">
        <input
          type="text"
          readOnly
          value={`${formData.coordinates?.length || 0} pontos`}
          className="form-control"
          placeholder="Stats"
        />
      </div>

      <div className="form-group">
        <TagSelector
          selectedTags={formData.tags}
          setSelectedTags={(tags) => setFormData({ ...formData, tags })}
          placeholder="Tags (opcional)"
        />
      </div>
    </div>
  );
};

RouteForm.propTypes = {
  formData: PropTypes.shape({
    title: PropTypes.string,
    starting_location: PropTypes.string,
    ending_location: PropTypes.string,
    description: PropTypes.string,
    coordinates: PropTypes.arrayOf(PropTypes.any),
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  setFormData: PropTypes.func,
};

export default RouteForm;
