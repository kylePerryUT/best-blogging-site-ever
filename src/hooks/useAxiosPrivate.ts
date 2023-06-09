import axios, { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

export const useAxiosPrivateWithAuth = () => {
  const navigate = useNavigate();
  const authContext = useAuth();
  const auth = authContext?.auth;

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        config.headers["Authorization"] = `${auth?.accessToken}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async () => {
        navigate("/");
      }
    );

    return () => {
      axiosPrivate.interceptors.response.eject(responseIntercept);
      axiosPrivate.interceptors.request.eject(requestIntercept);
    };
  }, [auth]);

  return axiosPrivate;
};

export const useAxiosPrivate = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async () => {
        navigate("/");
      }
    );

    return () => {
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [navigate]);

  return axiosPrivate;
};
