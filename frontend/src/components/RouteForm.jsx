import "../styles/RouteForm.css";
import TagSelector from "./TagSelector";
import PropTypes from "prop-types";

const RouteForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (file) => {
    setFormData({ ...formData, image: file });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">
          Criar rota
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Título"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="starting_location">Origem</Label>
            <Input
              id="starting_location"
              name="starting_location"
              value={formData.starting_location}
              onChange={handleChange}
              placeholder="Origem"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ending_location">Destino</Label>
            <Input
              id="ending_location"
              name="ending_location"
              value={formData.ending_location}
              onChange={handleChange}
              placeholder="Destino"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descrição"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coordinates">Pontos</Label>
          <Input
            id="coordinates"
            readOnly
            value={`${formData.coordinates?.length || 0} pontos`}
            className="bg-muted"
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
