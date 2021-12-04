import React, { Component } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardImg,
  CardText,
  CardBody,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { Link } from "react-router-dom";
import { Control, LocalForm, Errors } from "react-redux-form";
import { Loading } from "./LoadingComponent";
import { baseUrl } from "../shared/baseUrl";
import { FadeTransform, Fade, Stagger } from "react-animation-components";

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !val || val.length <= len;
const minLength = (len) => (val) => val && val.length >= len;
const isNumber = (val) => !isNaN(+val);

class CommentForm extends Component {
  state = {
    isModalOpen: false,
    rating: "",
    author: "",
    text: "",
    touched: {
      rating: false,
      author: false,
      text: false,
    },
  };

  toggleModal = () => {
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    });
  };

  handleSubmit = (values) => {
    this.toggleModal();
    this.props.postComment(
      this.props.campsiteId,
      values.rating,
      values.author,
      values.text
    );
  };

  render() {
    return (
      <React.Fragment>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            <ModalBody>
              <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                <FormGroup>
                  <div className="form-group">
                    <Label htmlFor="rating">Rating</Label>
                    <Control.select
                      className="form-control"
                      id="rating"
                      name="rating"
                      model=".rating"
                      validators={{
                        isNumber,
                      }}
                    >
                      <option>Pick a rating...</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </Control.select>
                    <Errors
                      className="text-danger"
                      model=".rating"
                      show="touched"
                      component="div"
                      messages={{
                        required: "Required",
                        isNumber: "Please choose a rating",
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <Label htmlFor="author">Author</Label>
                    <Control.text
                      className="form-control"
                      id="author"
                      name="author"
                      model=".author"
                      placeholder="Your Name"
                      validators={{
                        required,
                        minLength: minLength(2),
                        maxLength: maxLength(15),
                      }}
                    ></Control.text>
                    <Errors
                      className="text-danger"
                      model=".author"
                      show="touched"
                      component="div"
                      messages={{
                        required: "Required",
                        minLength: "Must be at least 2 characters",
                        maxLength: "Must be 15 characters or less",
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <Label htmlFor="text">Text</Label>
                    <Control.textarea
                      className="form-control"
                      id="text"
                      name="text"
                      model=".text"
                      placeholder="Enter your comment (150 characters or less)"
                      rows={6}
                      validators={{
                        required,
                        minLength: minLength(2),
                        maxLength: maxLength(150),
                      }}
                    ></Control.textarea>
                    <Errors
                      className="text-danger"
                      model=".text"
                      show="touched"
                      component="div"
                      messages={{
                        required: "Required",
                        minLength: "Must be at least 2 characters",
                        maxLength: "Must be 150 characters or less",
                      }}
                    />
                  </div>
                  <Button
                    onSubmit={this.handleSubmit}
                    color="primary"
                    type="submit"
                  >
                    Submit
                  </Button>
                </FormGroup>
              </LocalForm>
            </ModalBody>
          </ModalHeader>
        </Modal>
        <Button
          color="primary"
          onClick={this.toggleModal}
          outline
          className="fa fa-pencil fa-lg"
        >
          Submit Comment
        </Button>
      </React.Fragment>
    );
  }
}

function RenderCampsite({ campsite }) {
  return (
    <div className="col-md-5 m-1">
      <FadeTransform
        in
        transformProps={{
          exitTransform: "scale(0.5) translateY(-50%)",
        }}
      >
        <Card>
          <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
          <CardBody>
            <CardText>{campsite.description}</CardText>
          </CardBody>
        </Card>
      </FadeTransform>
    </div>
  );
}

function RenderComments({ comments, postComment, campsiteId }) {
  if (comments) {
    return (
      <div className="col-md-5 m-1">
        <h4>Comments</h4>
        <Stagger in>
          {comments.map((comment) => {
            return (
              <Fade in key={comment.id}>
                <div>
                  <div>{comment.text}</div>
                  <p>
                    -- {comment.author},{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    }).format(new Date(Date.parse(comment.date)))}
                  </p>
                </div>
              </Fade>
            );
          })}
        </Stagger>
        <CommentForm campsiteId={campsiteId} postComment={postComment} />
      </div>
    );
  }
  return <div />;
}
function CampsiteInfo(props) {
  if (props.isLoading) {
    return (
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    );
  }
  if (props.errMess) {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <h4>{props.errMess}</h4>
          </div>
        </div>
      </div>
    );
  }
  if (props.campsite) {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <Breadcrumb>
              <BreadcrumbItem>
                <Link to="/directory">Directory</Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
            </Breadcrumb>
            <h2>{props.campsite.name}</h2>
            <hr />
          </div>
        </div>
        <div className="row">
          <RenderCampsite campsite={props.campsite} />
          <RenderComments
            comments={props.comments}
            postComment={props.postComment}
            campsiteId={props.campsite.id}
          />
        </div>
      </div>
    );
  }
  return <div />;
}

export default CampsiteInfo;
