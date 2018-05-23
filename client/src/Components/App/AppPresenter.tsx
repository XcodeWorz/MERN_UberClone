import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import EmailLogin from "../../Routes/EmailLogin";
import Login from "../../Routes/Login";

interface IAppPresenterProps {
  isLoggedIn: boolean;
}

const AppPresenter: React.SFC<IAppPresenterProps> = ({ isLoggedIn }) => (
  <BrowserRouter>
    {isLoggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes />}
  </BrowserRouter>
);

const LoggedOutRoutes: React.SFC = () => (
  <Switch>
    <Route exact={true} path="/" component={Login} />
    <Route path="/email-login" component={EmailLogin} />
  </Switch>
);

const LoggedInRoutes: React.SFC = () => <React.Fragment>Hello</React.Fragment>;

export default AppPresenter;
