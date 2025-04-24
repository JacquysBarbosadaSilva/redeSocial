import { S3Client } from "@aws-sdk/client-s3";

const REGION = "us-east-1"; // Ex: região São Paulo
const BUCKET_NAME = "likee-bucket";

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: "ASIAYS5ERST6JT4QBEGO",
    secretAccessKey: "4yRbnahhCiLy8zSm2kUgaHXcLenBiEsF+m3lvFGI",
    aws_session_token:
      "IQoJb3JpZ2luX2VjEG8aCXVzLXdlc3QtMiJHMEUCIQCy0aPf2s1soAD9+Dpc0WZas0JPQnpu0SpSiX58iXlndAIgNPWk5Zoj8IWDfW+eW9Z687FR+WzROx5FxRHiIARnn5wquAII+P//////////ARAAGgw1OTAzNjYyMTc0NjgiDOCztpbDcufeeoFoziqMAh5TCJ1GAjrnRvh/wNxykrGofWO/EYVTjyOepO/Ne65bBhUArJrL8itaniCvm6tlqRxnEwmgIM3B8o17ch1nXfsYxD8RfRM1L9GfTVTWWOZcwtwmRzokYzNuvXXNQhpofHLc5l3xS+/y12bJDhF6KajdWeRIypvsHwGUpGIc6kPrnkLUqD084XuOWE88Au+XNf7BopRb+5iEF6MxGDGrjtSKXy+hXxnBQ+8u3m/2kYlspF4fhKWsVrttuKbJTQ292lJlRvsJn8dcyu81YvtVneTvC7wccWdloGZWEOD9pyKFxwiiDTrvcavy/0fE6ylG15NiDE5Gtdam8jxKGyrdcx6C+sYRrSQAvsLKK1EwsdClwAY6nQFYRKv+516hl4dkQ+6YLDJnk6raP1KIT9t+Tf5r+afw3T/hPwjPz6l0S3D+8FzFR24+NUpUaox/c8v006oBiLWunA9AXGJGj5wUhqMxiLxit565A5tOP3YEyBnna0vDLegy25SDKQkr4YWp2hBtU1b+VBASZw9kFXOCYTlo68z0IhQi3KpP+Zujm1ZzpwVKHPhZ8JusBWC5P7LTVaQv",
  },
});

export { s3, BUCKET_NAME };
