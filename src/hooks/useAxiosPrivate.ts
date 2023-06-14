import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

export const useAxiosPrivateWithAuth = () => {
  const navigate = useNavigate();
  const authState = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        config.headers["Authorization"] = `${authState?.auth.token}`;
        return config;
      },
      (error) => {
        console.log(
          "logging error from axiosPrivateWithAuth requestInterceptor: ",
          error
        );
        return Promise.reject(error);
      }
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      (error) => {
        console.log(
          "logging error from axiosPrivateWithAuth responseInterceptor: ",
          error
        );
        navigate("/");
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.response.eject(responseIntercept);
      axiosPrivate.interceptors.request.eject(requestIntercept);
    };
  }, [authState, navigate]);

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
